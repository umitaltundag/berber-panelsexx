import { NextResponse } from 'next/server';

export function ok(data: unknown) {
  return NextResponse.json({ success: true, data });
}

export function created(data: unknown) {
  return NextResponse.json({ success: true, data }, { status: 201 });
}

export function bad(message: string) {
  return NextResponse.json({ success: false, error: message }, { status: 400 });
}

export function unauthorized(message = 'Yetkisiz erişim') {
  return NextResponse.json({ success: false, error: message }, { status: 401 });
}

export function notFound(message = 'Kayıt bulunamadı') {
  return NextResponse.json({ success: false, error: message }, { status: 404 });
}

export function serverError(error: unknown) {
  const message = error instanceof Error ? error.message : 'Sunucu hatası';
  return NextResponse.json({ success: false, error: message }, { status: 500 });
}
