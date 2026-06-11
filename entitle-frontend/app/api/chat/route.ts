import { NextRequest, NextResponse } from 'next/server'

function normalizeBase(url: string): string {
  const stripped = url.replace(/\/+$/, '')
  if (stripped.endsWith('/api')) return stripped
  return `${stripped}/api`
}

export async function POST(req: NextRequest) {
  const body = await req.json()
  const token =
    req.cookies.get('entitle_token')?.value ||
    req.headers.get('Authorization')?.replace('Bearer ', '')

  const apiBase = normalizeBase(process.env.NEXT_PUBLIC_API_URL ?? 'http://localhost:8000/api')
  const res = await fetch(
    `${apiBase}/chat/message/`,
    {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        ...(token ? { Authorization: `Bearer ${token}` } : {}),
      },
      body: JSON.stringify(body),
    }
  )

  const data = await res.json()
  return NextResponse.json(data, { status: res.status })
}
