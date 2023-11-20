import AvatarEditor from '../../../../../_components/molecules/ImageCropper/AvatarEditor';
import BannerEditor from '../../../../../_components/molecules/ImageCropper/BannerEditor';
import BaseView from '../../../../../_components/templates/BaseView';

import TextAreaInput from '../../../../../_components/molecules/Input/Uncontrolled/String/TextAreaInput';
import Button from '../../../../../_components/molecules/Button/Button';
import TextInput from '../../../../../_components/molecules/Input/Uncontrolled/String/TextInput';

// import { useForm } from '../../../../_hooks/form/useForm';
// import { useTenantManage } from '../../../../../_context/navigation';

import prisma from '../../../../../../database/prisma/db';
import { tenantDetails } from '../../../../../../types/prisma/Tenant/tenant-details';

import { ActionType } from '@okampus/shared/enums';
import { ActorImageType, ActorType } from '@prisma/client';
// import { useState } from 'react';

import type { DomainParams } from '../../../../../params.type';

export default async function TenantProfilePage({ params }: DomainParams) {
  // const { tenantManage } = useTenantManage();
  const tenantManage = await prisma.tenant.findFirst({
    where: { domain: params.domain },
    select: tenantDetails.select,
  });

  const defaultValues = {
    name: tenantManage?.actor.name ?? '',
    status: tenantManage?.actor.status ?? '',
    bio: tenantManage?.actor.bio ?? '',
  };
  // TODO
  // const [deactivateActorImage] = useDeleteActorImageMutation();

  // const [updateActor] = useUpdateActorMutation();

  // const [editingAvatar, setEditingAvatar] = useState(false);
  // const [editingBanner, setEditingBanner] = useState(false);

  // const { register, handleSubmit, reset, formState } = useForm({
  //   defaultValues,
  // });

  // const onSubmit = handleSubmit((update) => {
  //   // TODO
  //   // tenantManage && updateActor({ variables: { update, id: tenantManage.actor.id } });
  // });

  if (!tenantManage) return null;

  return (
    <BaseView header="Personnalisation">
      <form className="grid lg-max:grid-cols-1 lg:grid-cols-[24rem_1fr] gap-x-16">
        {/* <ChangeSetToast
          isDirty={formState.isDirty}
          isValid={formState.isValid}
          isLoading={formState.isSubmitting}
          onCancel={() => reset(defaultValues)}
        /> */}
        {/*         < heading="Logo"> */}
        <span className="flex gap-6">
          <AvatarEditor
            context={{ actorImageType: ActorImageType.Avatar, actorType: ActorType.Tenant }}
            actor={tenantManage.actor}
            size={128}
          />
          <div className="flex flex-col justify-between py-1">
            {/* <ActionButton
                action={{
                  label: 'Changer le logo',
                  action={() => setEditingAvatar(true)}
                  type={ActionType.Primary}

                }}
              /> */}
            {tenantManage.actor.avatar && (
              <Button
              // action={{
              //   label: 'Enlever le logo',
              //   // linkOrActionOrMenu: () =>
              //   //   deactivateActorImage({
              //   //     variables: {
              //   //       where: {
              //   //         type: { _eq: ActorImageType.Avatar },
              //   //         actorId: { _eq: tenantManage.actor.id },
              //   //         deletedAt: { _isNull: true },
              //   //       },
              //   //     },
              //   //   }),
              // }}
              >
                Enlever le logo
              </Button>
            )}
          </div>
        </span>
        {/*         </> */}
        <hr className="border-[var(--border-2)] my-10 col-[1/-1] hidden lg-max:block" />
        <div className="flex flex-col gap-4">
          <TextInput
            name="name"
            // name="name"
            // onChange={(event) => }
            // onErrorChange={(error) => changeErrors({ name: error })}
            // value={values.name}
            label="Nom"
          />
          <TextInput
            name="status"
            // name="status"
            // onChange={(event) => changeValues((values) => ({ ...values, status: event.target.value }))}
            // onErrorChange={(error) => changeErrors({ status: error })}
            // value={values.sttus}
            label="Slogan"
          />
        </div>
        <hr className="border-[var(--border-2)] my-10 col-[1/-1]" />
        {/*         < heading="Bannière"> */}
        <span className="flex flex-col gap-4">
          <BannerEditor
            context={{ actorType: ActorType.Tenant, actorImageType: ActorImageType.Banner }}
            actor={tenantManage.actor}
          />
          {/* <BannerImage
                    aspectRatio={BANNER_ASPECT_RATIO}
                    src={banner?.fileUpload.url}
                    name={teamManage.tenantManage.actorname}
                    className="grow border-4 border-[var(--border-2)]"
                  /> */}
          <div className="shrink-0 flex justify-between py-1.5">
            <Button
              type={ActionType.Primary}
              // action={() => setEditingBanner(true)}
              // action={{
              //   label: 'Changer la bannière',
              // }}
            >
              Changer la bannière
            </Button>
            {tenantManage.actor.banner && (
              <Button
              // action={{
              //   label: 'Enlever',
              // action={() => {}}
              // TODO
              // deactivateActorImage({
              //   variables: {
              //     where: {
              //       type: { _eq: ActorImageType.Banner },
              //       actorId: { _eq: tenantManage.actor.id },
              //       deletedAt: { _isNull: true },
              //     },
              //   },
              // }),
              // }}
              >
                Enlever
              </Button>
            )}
          </div>
        </span>
        {/*         </> */}
        <hr className="border-[var(--border-2)] my-10 col-[1/-1] hidden lg-max:block" />
        <TextAreaInput
          name="bio"
          // value={values.bio}
          // onChange={(value) => changeValues((values) => ({ ...values, bio: value }))}
          // onErrorChange={(error) => changeErrors({ bio: error })}
          rows={10}
          label="Description"
        />
      </form>
    </BaseView>
  );

  // return (
  //   <ViewLayout header="Personnalisation">
  //     <ChangeSetForm
  //       // @ts-ignore
  //       onSave={(update) => actor && updateActor({ variables: { update, id: tenantManage.actorid } })}
  //       initialValues={initialState}
  //       checkFields={[]}
  //       renderChildren={({ changeErrors, changeValues, values }) =>
  //         adminTeam &&
  //         actor && (
  //           <span className="grid lg-max:grid-cols-1 lg:grid-cols-[auto_1fr] gap-x-16">
  //             <GroupItem heading="Avatar">
  //               <span className="flex gap-6">
  //                 <AvatarEditor
  //                   showEditor={editingAvatar}
  //                   setShowEditor={setEditingAvatar}
  //                   actor={actor}
  //                   size={48}
  //
  //                 />
  //                 <div className="flex flex-col justify-between py-1">
  //                   <ActionButton
  //                     action={{
  //                       label: 'Changer le logo',
  //                       action={() => setEditingAvatar(true)}
  //                       type={ActionType.Primary}

  //                     }}
  //                   />
  //                   {avatar && (
  //                     <ActionButton
  //                       action={{
  //                         label: 'Enlever le logo',
  //                         linkOrActionOrMenu: () =>
  //                           deactivateActorImage({ variables: { id: avatar.id, now: new Date().toISOString() } }),
  //                       }}
  //                     />
  //                   )}
  //                 </div>
  //               </span>
  //             </GroupItem>
  //             <hr className="border-[var(--border-2)] my-10 col-[1/-1] hidden lg-max:block" />
  //             <GroupItem heading="En-tête" groupClassName="flex flex-col gap-4 py-1">
  //               <TextInput
  //                 onChange={(value) => changeValues((values) => ({ ...values, name: value }))}
  //                 onErrorChange={(error) => changeErrors({ name: error })}
  //                 value={values.name}
  //                 options={{ label: 'Nom' }}
  //               />
  //               <TextInput
  //                 onChange={(value) => changeValues((values) => ({ ...values, status: value }))}
  //                 onErrorChange={(error) => changeErrors({ status: error })}
  //                 value={values.status}
  //                 options={{ label: 'Slogan' }}
  //               />
  //             </GroupItem>
  //             <hr className="border-[var(--border-2)] my-10 col-[1/-1]" />
  //             <GroupItem heading="Bannière">
  //               <span className="flex flex-col gap-4">
  //                 <BannerEditor showEditor={editingBanner} setShowEditor={setEditingBanner} actor={actor} />
  //                 <div className="shrink-0 flex justify-between py-1.5">
  //                   <ActionButton
  //                     action={{
  //                       label: 'Changer la bannière',
  //                       action={() => setEditingBanner(true)}
  //                       type={ActionType.Primary}

  //                     }}
  //                   />
  //                   {banner && (
  //                     <ActionButton
  //                       action={{
  //                         label: 'Enlever',
  //                         linkOrActionOrMenu: () =>
  //                           deactivateActorImage({ variables: { id: banner.id, now: new Date().toISOString() } }),
  //                       }}
  //                     />
  //                   )}
  //                 </div>
  //               </span>
  //             </GroupItem>
  //             <hr className="border-[var(--border-2)] my-10 col-[1/-1] hidden lg-max:block" />
  //             <GroupItem heading="Présentation longue" groupClassName="flex flex-col gap-5">
  //               <TextInput
  //                 value={values.bio}
  //                 onChange={(value) => changeValues((values) => ({ ...values, bio: value }))}
  //                 onErrorChange={(error) => changeErrors({ bio: error })}
  //                 rows={10}
  //                 options={{ label: 'Description' }}
  //               />
  //             </GroupItem>
  //           </span>
  //         )
  //       }
  //     />
  //   </ViewLayout>
  // );
}
