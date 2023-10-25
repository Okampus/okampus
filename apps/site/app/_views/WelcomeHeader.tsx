import { useMe } from '../_context/navigation';

export default function WelcomeHeader() {
  const me = useMe();
  const now = new Date();
  return `${now.getHours() > 7 && now.getHours() < 18 ? 'Bonjour' : 'Bonsoir'} ${me.firstName} !`;
}
