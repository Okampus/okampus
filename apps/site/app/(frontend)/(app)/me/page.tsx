'use client';

import ViewLayout from '../../../../components/atoms/Layout/ViewLayout';
// import SocialsForm from '../../../../components/forms/SocialsForm';

import { useMe } from '../../../../context/navigation';

export default function UserPage() {
  const me = useMe();

  return (
    <ViewLayout innerClassName="relative" header="Mon profil">
      {/* TODO: custom use SocialsForm */}
      {/* <div className="shrink-0 flex flex-col">
        <SocialsForm initialSocials={me.user.actor.socials} onSubmit={(socials) => {}} />
      </div> */}
    </ViewLayout>
  );
}
