'use client';

import ViewLayout from '../../../../_components/atoms/Layout/ViewLayout';
// import SocialsForm from '../../../../_components/forms/SocialsForm';

import { useMe } from '../../../../_context/navigation';

export default function UserPage() {
  const me = useMe();

  return (
    <ViewLayout innerClassName="relative" header={me.actor.name}>
      {/* TODO: custom use SocialsForm */}
      {/* <div className="shrink-0 flex flex-col">
        <SocialsForm initialSocials={me.actor.socials} onSubmit={(socials) => {}} />
      </div> */}
    </ViewLayout>
  );
}
