'use client';
import { useMe } from '../_hooks/context/useMe';

export default function WelcomeHeader() {
  const { data: me } = useMe();
  const now = new Date();
  return `${now.getHours() > 7 && now.getHours() < 18 ? 'Bonjour' : 'Bonsoir'} ${me.firstName} !`;
}
