"""
Celery tasks: rescan_profile, rescan_all_profiles
Runs EligibilityAgent for one or all profiles and creates notifications.
"""
from celery import shared_task


@shared_task(name='tasks.eligibility_rescan.rescan_profile')
def rescan_profile(profile_id: int):
    """
    Re-run the EligibilityAgent for a single profile.
    Creates a notification if new eligible schemes are found.
    """
    from apps.chat.agents.eligibility_agent import EligibilityAgent
    from apps.profiles.models import CivicProfile
    from apps.notifications.models import Notification

    try:
        profile = CivicProfile.objects.get(id=profile_id)
    except CivicProfile.DoesNotExist:
        return f'Profile {profile_id} not found.'

    agent = EligibilityAgent()
    entitlements = agent.run(profile_id)

    # Count entitlements that haven't been applied yet
    new_count = sum(1 for e in entitlements if not e.applied_at)

    if new_count > 0:
        Notification.objects.create(
            profile=profile,
            title='New entitlements found!',
            body=(
                f'We found {new_count} scheme(s) you qualify for after '
                f're-scanning your profile.'
            ),
            notification_type='new_scheme',
        )

    return (
        f'Rescanned profile {profile_id}. '
        f'Found {len(entitlements)} entitlements ({new_count} unapplied).'
    )


@shared_task(name='tasks.eligibility_rescan.rescan_all_profiles')
def rescan_all_profiles():
    """
    Queue a rescan task for every CivicProfile in the database.
    """
    from apps.profiles.models import CivicProfile

    profile_ids = list(CivicProfile.objects.values_list('id', flat=True))
    for pid in profile_ids:
        rescan_profile.delay(pid)

    return f'Queued rescan for {len(profile_ids)} profile(s).'
