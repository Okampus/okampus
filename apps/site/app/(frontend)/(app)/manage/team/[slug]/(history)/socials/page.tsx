'use client';

import GroupItem from '../../../../../../../../components/atoms/Item/GroupItem';
import ViewLayout from '../../../../../../../../components/atoms/Layout/ViewLayout';
import SocialIcon from '../../../../../../../../components/atoms/Icon/SocialIcon';
import Profile from '../../../../../../../../components/layouts/SidePanel/Profile';

import EditSocialCard from '../../../../../../../../components/molecules/Card/EditSocialCard';
import ChangeSetForm from '../../../../../../../../components/molecules/Form/ChangeSetForm';
import DragList from '../../../../../../../../components/molecules/List/DragList';
import TextInput from '../../../../../../../../components/molecules/Input/TextInput';

import { useTeamManage } from '../../../../../../../../context/navigation';
import { useCurrentBreakpoint } from '../../../../../../../../hooks/useCurrentBreakpoint';

import { filterCache, mergeCache } from '../../../../../../../../utils/apollo/merge-cache';
import { validateEmail } from '../../../../../../../../utils/form-validation/email';
import { validateWebsite } from '../../../../../../../../utils/form-validation/website';

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

import type { SocialInfo } from '../../../../../../../../components/molecules/Card/EditSocialCard';

export default function TeamManageSocials({ params }: { params: { slug: string } }) {
  const { teamManage } = useTeamManage(params.slug);
  const currentWindowSize = useCurrentBreakpoint();

  const socials: Array<SocialInfo & { id?: string }> =
    teamManage?.actor?.socials.map((social) => ({
      id: social.id,
      type: social.type as SocialType,
      url: social.url,
      pseudo: social.pseudo,
      order: social.order,
    })) || [];

  const initialState = {
    email: teamManage?.actor?.email || '',
    website: teamManage?.actor?.website || '',
    socials,
  };

  // @ts-ignore
  const [deleteSocialMany] = useMutation(deleteSocialManyMutation);
  const [insertSocialMany] = useMutation(insertSocialManyMutation);
  const [updateSocialMany] = useMutation(updateSocialManyMutation);

  const [updateActor] = useMutation(updateActorMutation);

  if (!teamManage || !teamManage.actor) return null;

  const isSmall = currentWindowSize === 'mobile' || currentWindowSize === 'tablet';
  console.log('scrollable', isSmall);

  return (
    <ViewLayout header="Réseaux & contacts" className="pr-0" scrollable={isSmall} bottomPadded={false}>
      <ChangeSetForm
        className="h-full grid 2xl-max:grid-cols-1 2xl:grid-flow-col 2xl:grid-cols-[var(--w-sidepanel)_1fr] gap-x-2"
        checkFields={['email', 'website', ...socials.map((social) => social.type)]}
        initialValues={initialState}
        onSave={(values) => {
          if (teamManage?.actor) {
            if (values.email || values.website) {
              const update = { email: values.email, website: values.website };
              // @ts-ignore
              updateActor({ variables: { id: teamManage.actor.id, update } });
            }

            const deleteSocials = initialState.socials.filter(
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
                (social, idx) => social.id && !deepEqual(initialState.socials[idx], social)
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
        }}
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
      />
    </ViewLayout>
  );
}
