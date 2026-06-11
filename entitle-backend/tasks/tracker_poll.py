"""
Celery task: poll_application_status
Simulates government portal polling to update application statuses
and create notifications when statuses change.
"""
import random
from celery import shared_task


@shared_task(name='tasks.tracker_poll.poll_application_status')
def poll_application_status():
    """
    Polls all in-flight entitlements (status: applied/submitted)
    and simulates government portal status updates.
    Creates notifications for any status changes.
    """
    from apps.entitlements.models import Entitlement
    from apps.notifications.models import Notification

    in_flight = list(
        Entitlement.objects.filter(
            status__in=['applied', 'submitted']
        ).select_related('scheme', 'profile')
    )
    updated = 0

    for entitlement in in_flight:
        # 10% chance of a status change per poll cycle
        roll = random.random()
        if roll >= 0.1:
            continue

        old_status = entitlement.status

        if entitlement.status == 'applied':
            entitlement.status = 'submitted'
        elif entitlement.status == 'submitted':
            # 7% chance of approval, 3% chance of needs_docs
            entitlement.status = 'approved' if roll < 0.07 else 'needs_docs'

        if entitlement.status != old_status:
            entitlement.save(update_fields=['status'])
            updated += 1

            Notification.objects.create(
                profile=entitlement.profile,
                title=f'{entitlement.scheme.name} status updated',
                body=(
                    f'Your application for {entitlement.scheme.name} is now '
                    f'"{entitlement.get_status_display()}". '
                    + (
                        'Congratulations! Your benefit will be processed shortly.'
                        if entitlement.status == 'approved'
                        else 'Please check the portal for next steps.'
                    )
                ),
                notification_type='status_change',
            )

    return (
        f'Polled {len(in_flight)} in-flight application(s). '
        f'Updated {updated} status(es).'
    )
