'use client';

import Sidebar from '../../../../_components/layouts/Sidebar';
import BaseView from '../../../../_components/templates/BaseView';
// import SocialsForm from '../../../../_components/forms/SocialsForm';

import { useMe } from '../../../../_hooks/context/useMe';

export default function UserPage() {
  const { data: me } = useMe();

  return (
    <>
      <Sidebar />
      <BaseView innerClassName="relative" header={me.actor.name}>
        {/* TODO: custom use SocialsForm */}
        {/* <div className="shrink-0 flex flex-col">
        <SocialsForm initialSocials={me.actor.socials} onSubmit={(socials) => {}} />
      </div> */}
      </BaseView>
    </>
  );
}
