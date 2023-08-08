'use client';

import GroupItem from '../../../../../../../../components/atoms/Item/GroupItem';
import ViewLayout from '../../../../../../../../components/atoms/Layout/ViewLayout';
import SocialIcon from '../../../../../../../../components/atoms/Icon/SocialIcon';
import Profile from '../../../../../../../../components/layouts/SidePanel/Profile';

// import EditSocialCard from '../../../../../../../../components/molecules/Card/EditSocialCard';
import DragList from '../../../../../../../../components/molecules/List/DragList';
import TextInput from '../../../../../../../../components/molecules/Input/TextInput';

import { useTeamManage } from '../../../../../../../../context/navigation';
import { useCurrentBreakpoint } from '../../../../../../../../hooks/useCurrentBreakpoint';
// import { useForm } from '../../../../../../../../hooks/form/useForm';

import { filterCache, mergeCache } from '../../../../../../../../utils/apollo/merge-cache';

import { SocialType } from '@okampus/shared/enums';
import {
  deleteSocialManyMutation,
  insertSocialManyMutation,
  updateSocialManyMutation,
  updateActorMutation,
} from '@okampus/shared/graphql';
import { deepEqual } from '@okampus/shared/utils';

import { useMutation } from '@apollo/client';
import clsx from 'clsx';
import { useForm } from 'react-hook-form';

// import type { SocialInfo } from '../../../../../../../../components/molecules/Card/EditSocialCard';

export type SocialInfo = {
  id?: string;
  type: SocialType;
  url: string;
  pseudo: string;
  order: number;
};

export default function TeamManageSocials({ params }: { params: { slug: string } }) {
  const { teamManage } = useTeamManage(params.slug);
  const currentWindowSize = useCurrentBreakpoint();

  const defaultValues = {
    email: teamManage?.actor?.email ?? '',
    website: teamManage?.actor?.website ?? '',
    socials: (teamManage?.actor?.socials.map((social) => ({
      id: social.id,
      type: social.type,
      url: social.url,
      pseudo: social.pseudo,
      order: social.order,
    })) ?? []) as SocialInfo[],
  };

  // @ts-ignore
  const [deleteSocialMany] = useMutation(deleteSocialManyMutation);
  // @ts-ignore
  const [insertSocialMany] = useMutation(insertSocialManyMutation);
  // @ts-ignore
  const [updateSocialMany] = useMutation(updateSocialManyMutation);

  const [updateActor] = useMutation(updateActorMutation);

  const isSmall = currentWindowSize === 'mobile' || currentWindowSize === 'tablet';

  const { register, handleSubmit, formState, setValue, watch } = useForm({
    defaultValues,
  });

  const onSubmit = handleSubmit((values) => {
    if (teamManage?.actor) {
      if (values.email || values.website) {
        const update = { email: values.email, website: values.website };
        // @ts-ignore
        updateActor({ variables: { id: teamManage.actor.id, update } });
      }

      const deleteSocials = defaultValues.socials.filter(
        (social) => !values.socials?.some((value) => value.id === social.id)
      );

      if (deleteSocials.length > 0) {
        const _in = deleteSocials.map((social) => social.id);
        deleteSocialMany({
          variables: { where: { id: { _in } } },
          onCompleted: ({ deleteSocial: data }) => {
            if (!teamManage.actor || !data) return;

            filterCache(
              { __typename: 'Actor', id: teamManage.actor.id },
              { fieldName: 'socials', typename: 'Social' },
              data.returning.map((social) => social.id)
            );
          },
        });
      }

      if (values.socials?.length) {
        const newSocials = values.socials.filter((social) => !social.id);
        const updateSocials = values.socials.filter(
          (social, idx) => social.id && !deepEqual(defaultValues.socials[idx], social)
        );

        if (newSocials.length > 0) {
          const objects = newSocials.map((social) => ({ actorId: teamManage.actor?.id, ...social }));
          insertSocialMany({
            // @ts-ignore
            variables: { objects },
            onCompleted: ({ insertSocial: data }) => {
              if (!teamManage.actor || !data) return;
              for (const social of data.returning) {
                mergeCache(
                  { __typename: 'Actor', id: teamManage.actor.id },
                  { fieldName: 'socials', fragmentOn: 'Social', data: social }
                );
              }
            },
          });
        }

        if (updateSocials.length > 0) {
          const updates = updateSocials.map(({ id, ..._set }) => ({ where: { id: { _eq: id } }, _set }));
          // @ts-ignore
          updateSocialMany({ variables: { updates } });
        }
      }
    }
  });

  if (!teamManage || !teamManage.actor) return null;

  const socials = watch('socials');
  const addableSocials = Object.values(SocialType).filter((value) => !socials.some((social) => social.type === value));

  return (
    <ViewLayout header="Réseaux & contacts" className="pr-0" scrollable={isSmall} bottomPadded={false}>
      <div className="col-span-1 pr-[var(--px-content)]">
        <GroupItem heading="Email & page/site externe">
          <TextInput
            {...register('email')}
            // onChange={(value) => changeValues((values) => ({ ...values, email: value }))}
            // value={values.email}
            // checkValueError={validateEmail}
            label="Email"
            // onErrorChange={(error) => changeErrors({ email: error })}
            // triggerCheck={checkingValues.email}
            // setTriggerCheck={(trigger) => changeCheckingValues({ email: trigger })}
          />
          <TextInput
            {...register('website')}
            // onChange={(value) => changeValues((values) => ({ ...values, website: value }))}
            // value={values.website}
            label="URL de votre site/page internet"
            // checkValueError={validateWebsite}
            // triggerCheck={checkingValues.website}
            // setTriggerCheck={(trigger) => changeCheckingValues({ website: trigger })}
            // onErrorChange={(error) => changeErrors({ website: error })}
          />
        </GroupItem>
        <hr className="border-color-2 my-10" />
        <GroupItem heading="Prévisualisation de vos réseaux">
          <Profile type="team" actor={teamManage.actor} socials={socials} />
        </GroupItem>
      </div>
      <div className={clsx('h-full col-span-1 pr-[var(--px-content)]', !isSmall && 'scrollbar overflow-y-scroll')}>
        {addableSocials.length > 0 && (
          <GroupItem className="bg-2 p-4 rounded-2xl" heading="Ajouter des réseaux à votre profil">
            <div className="text-xs">Cliquez sur un réseau pour ajouter un lien qui apparaîtra sur votre profil.</div>
            <span className="flex gap-4 items-center flex-wrap">
              {addableSocials.map((value) => (
                <SocialIcon
                  className="shrink-0 bg-3"
                  key={value}
                  social={value}
                  onClick={() => {
                    const shiftedSocials = socials.map((social) => ({ ...social, order: social.order + 1 }));
                    setValue('socials', [{ type: value, url: '', pseudo: '', order: 0 }, ...shiftedSocials]);
                  }}
                />
              ))}
            </span>
          </GroupItem>
        )}
        <DragList
          className="pb-24"
          onChange={(items) => {
            const socials = items.map((item, order) => ({ ...item.value, order }));
            setValue('socials', socials);
            // const other = Object.values(SocialType).filter((type) => !items.some(({ value }) => value.type === type));
            // changeCheckingValues(Object.fromEntries(otherSocials.map((value) => [value, undefined])));
            // changeErrors(Object.fromEntries(otherSocials.map((value) => [value, null])));
          }}
          items={socials.map((social) => ({
            value: social,
            key: social.type,
            label: (
              <li>
                <SocialIcon social={social.type as SocialType} />
                <GroupItem heading={`${social.type} ${social.pseudo ? `• ${social.pseudo}` : ''}`} className="py-1">
                  <TextInput name={`social.${social.type}`} />
                  {/* {social.type === SocialType.Discord ? (
                    <TextInput name="discord" label label="Lien d'invitation" />
                  ) : // <DiscordInviteInput
                  //   invite={social.url}
                  //   onErrorChange={onErrorChange}
                  //   triggerCheck={triggerCheck}
                  //   setTriggerCheck={setTriggerCheck}
                  //   onChange={(value) =>
                  //     onChange({ ...social, pseudo: value.guildName, url: `https://discord.gg/${value.code}` })
                  //   }
                  //   onChangeInvite={(value) => onChange({ ...social, url: value })}
                  // />
                  social.type === SocialType.Instagram ? (
                    <TextInput
                      name="instagram"
                      // allowedChars={/^[\w.]*$/}
                      // onErrorChange={onErrorChange}
                      // value={social.pseudo}
                      // checkValueError={required}
                      // triggerCheck={triggerCheck}
                      // setTriggerCheck={setTriggerCheck}
                      onChange={(event) =>
                        onChange({
                          ...social,
                          pseudo: event.target.value,
                          url: `https://www.instagram.com/${event.target.value}`,
                        })
                      }
                      prefix="instagram.com/"
                      label="handle (sans @)"
                    />
                  ) : social.type === SocialType.TikTok ? (
                    <TextInput
                      name="tiktok"
                      // allowedChars={/^[\w.]*$/}
                      // onErrorChange={onErrorChange}
                      value={social.pseudo}
                      // checkValueError={required}
                      // triggerCheck={triggerCheck}
                      // setTriggerCheck={setTriggerCheck}
                      onChange={(event) =>
                        onChange({
                          ...social,
                          pseudo: event.target.value,
                          url: `https://www.tiktok.com/@${event.target.value}`,
                        })
                      }
                      prefix="tiktok.com/@"
                      label="handle"
                    />
                  ) : social.type === SocialType.LinkedIn ? (
                    <TextInput
                      name="linkedin"
                      // onErrorChange={onErrorChange}
                      value={social.pseudo}
                      // checkValueError={required}
                      // triggerCheck={triggerCheck}
                      // setTriggerCheck={setTriggerCheck}
                      onChange={(event) =>
                        onChange({
                          ...social,
                          pseudo: event.target.value,
                          url: `https://www.linkedin.com/company/${event.target.value}`,
                        })
                      }
                      prefix="linkedin.com/company/"
                      label="nom"
                    />
                  ) : social.type === SocialType.Facebook ? (
                    <TextInput
                      name="facebook"
                      // onErrorChange={onErrorChange}
                      value={social.url}
                      // checkValueError={required}
                      // triggerCheck={triggerCheck}
                      // setTriggerCheck={setTriggerCheck}
                      onChange={(event) => onChange({ ...social, pseudo: event.target.value, url: event.target.value })}
                      label="URL de votre page"
                    />
                  ) : social.type === SocialType.YouTube ? (
                    <TextInput
                      name="youtube"
                      // onErrorChange={onErrorChange}
                      value={social.pseudo}
                      // checkValueError={required}
                      // triggerCheck={triggerCheck}
                      // setTriggerCheck={setTriggerCheck}
                      onChange={(event) =>
                        onChange({
                          ...social,
                          pseudo: event.target.value,
                          url: `https://www.youtube.com/channel/${event.target.value}`,
                        })
                      }
                      prefix="youtube.com/channel/"
                      label="ID de la chaîne"
                    />
                  ) : social.type === SocialType.Twitch ? (
                    <TextInput
                      name="twitch"
                      // onErrorChange={onErrorChange}
                      value={social.pseudo}
                      // checkValueError={required}
                      // triggerCheck={triggerCheck}
                      // setTriggerCheck={setTriggerCheck}
                      onChange={(event) =>
                        onChange({
                          ...social,
                          pseudo: event.target.value,
                          url: `https://www.twitch.tv/${event.target.value}`,
                        })
                      }
                      prefix="twitch.tv/"
                      label="ID de la chaîne"
                    />
                  ) : social.type === SocialType.GitHub ? (
                    <TextInput
                      name="github"
                      // onErrorChange={onErrorChange}
                      value={social.pseudo}
                      // checkValueError={required}
                      // triggerCheck={triggerCheck}
                      // setTriggerCheck={setTriggerCheck}
                      onChange={(event) =>
                        onChange({
                          ...social,
                          pseudo: event.target.value,
                          url: `https://www.github.com/${event.target.value}`,
                        })
                      }
                      prefix="github.com/"
                      label="nom de l'organisation"
                    />
                  ) : null} */}
                </GroupItem>
              </li>
            ),
          }))}
        />
      </div>
      {/* <ChangeSetForm
        className="h-full grid 2xl-max:grid-cols-1 2xl:grid-flow-col 2xl:grid-cols-[var(--w-sidepanel)_1fr] gap-x-2"
        checkFields={['email', 'website', ...socials.map((social) => social.type)]}
        initialValues={defaultValues}
        onSave={onSave}
        renderChildren={({ changeErrors, changeValues, values, checkingValues, changeCheckingValues }) => {
          const addableSocials = Object.values(SocialType).filter(
            (value) => !values.socials.some((social) => social.type === value)
          );

          return (
            <>
              <div className="col-span-1 pr-[var(--px-content)]">
                <GroupItem heading="Email & page/site externe">
                  <TextInput
                    onChange={(value) => changeValues((values) => ({ ...values, email: value }))}
                    value={values.email}
                    checkValueError={validateEmail}
                    options={{ label: 'Email' }}
                    onErrorChange={(error) => changeErrors({ email: error })}
                    triggerCheck={checkingValues.email}
                    setTriggerCheck={(trigger) => changeCheckingValues({ email: trigger })}
                  />
                  <TextInput
                    onChange={(value) => changeValues((values) => ({ ...values, website: value }))}
                    value={values.website}
                    options={{ label: 'URL de votre site/page internet' }}
                    checkValueError={validateWebsite}
                    triggerCheck={checkingValues.website}
                    setTriggerCheck={(trigger) => changeCheckingValues({ website: trigger })}
                    onErrorChange={(error) => changeErrors({ website: error })}
                  />
                </GroupItem>
                <hr className="border-color-2 my-10" />
                <GroupItem heading="Prévisualisation de vos réseaux">
                  <Profile type="team" actor={teamManage.actor} socials={values.socials} />
                </GroupItem>
              </div>
              <div
                className={clsx('h-full col-span-1 pr-[var(--px-content)]', !isSmall && 'scrollbar overflow-y-scroll')}
              >
                {addableSocials.length > 0 && (
                  <GroupItem className="bg-2 p-4 rounded-2xl" heading="Ajouter des réseaux à votre profil">
                    <div className="text-xs">
                      Cliquez sur un réseau pour ajouter un lien qui apparaîtra sur votre profil.
                    </div>
                    <span className="flex gap-4 items-center flex-wrap">
                      {addableSocials.map((value) => (
                        <SocialIcon
                          className="shrink-0 bg-3"
                          key={value}
                          social={value}
                          onClick={() => {
                            changeValues((values) => ({
                              ...values,
                              socials: [
                                { type: value, url: '', pseudo: '', order: 0 },
                                ...values.socials.map((social) => ({ ...social, order: social.order + 1 })),
                              ],
                            }));
                            changeCheckingValues({ [value]: true });
                          }}
                        />
                      ))}
                    </span>
                  </GroupItem>
                )}
                <DragList
                  className="pb-24"
                  onChange={(items) => {
                    changeValues((values) => ({
                      ...values,
                      socials: items.map((item, i) => ({ ...item.value, order: i })),
                    }));
                    const otherSocials = Object.values(SocialType).filter(
                      (value) => !items.some((item) => item.value.type === value)
                    );
                    changeCheckingValues(Object.fromEntries(otherSocials.map((value) => [value, undefined])));
                    changeErrors(Object.fromEntries(otherSocials.map((value) => [value, null])));
                  }}
                  items={values.socials.map((social) => ({
                    value: social,
                    key: social.type,
                    label: (
                      <EditSocialCard
                        social={social}
                        triggerCheck={checkingValues[social.type]}
                        setTriggerCheck={(trigger) => changeCheckingValues({ [social.type]: trigger })}
                        onErrorChange={(error) => changeErrors({ [social.type]: error })}
                        onChange={(value) =>
                          changeValues((values) => ({
                            ...values,
                            socials: values.socials.map((social) => (social.type === value.type ? value : social)),
                          }))
                        }
                      />
                    ),
                  }))}
                />
              </div>
            </>
          );
        }}
      /> */}
    </ViewLayout>
  );
}
