'use client';

import SocialIcon from '../../../../../components/atoms/Icon/SocialIcon';
import AvatarImage from '../../../../../components/atoms/Image/AvatarImage';
import GroupItem from '../../../../../components/atoms/Item/GroupItem';
import ViewLayout from '../../../../../components/atoms/Layout/ViewLayout';
import CTAButton from '../../../../../components/molecules/Button/CTAButton';
import EventCard from '../../../../../components/molecules/Card/EventCard';
import FormRenderer from '../../../../../components/organisms/FormRenderer';

import { useMe, useTeam } from '../../../../../context/navigation';
import { useBottomSheet } from '../../../../../hooks/context/useBottomSheet';
import { useQueryAndSubscribe } from '../../../../../hooks/apollo/useQueryAndSubscribe';

import { notificationAtom } from '../../../../../context/global';
import { mergeCache } from '../../../../../utils/apollo/merge-cache';

import { GetTeamDocument, OrderBy, useInsertTeamJoinMutation } from '@okampus/shared/graphql';
import { EventState, TeamRoleType } from '@okampus/shared/enums';
import { ActionType, ToastType } from '@okampus/shared/types';
import { notFound } from 'next/navigation';
import { useAtom } from 'jotai';

import type { ActionCTA } from '../../../../../components/molecules/Button/CTAButton';
import type { SocialType } from '@okampus/shared/enums';
import type { GetEventsQuery, GetEventsQueryVariables } from '@okampus/shared/graphql';

export default function TeamPage({ params }: { params: { slug: string } }) {
  const me = useMe();
  const { team } = useTeam(params.slug);
  const [, setNotification] = useAtom(notificationAtom);
  const { openBottomSheet, closeBottomSheet } = useBottomSheet();

  const where = { eventOrganizes: { teamId: { _eq: team?.id } }, state: { _eq: EventState.Published } };
  const variables = { where, orderBy: [{ start: OrderBy.Desc }], limit: 3 };

  const { data } = useQueryAndSubscribe<GetEventsQuery, GetEventsQueryVariables>({ query: GetTeamDocument, variables });

  const [insertTeamJoin] = useInsertTeamJoinMutation();

  if (!team) notFound();

  const events = data?.event;
  const memberRole = team?.roles.find((role) => role.type === TeamRoleType.Member);

  const isMember = me.user.teamMembers.some((member) => member.team.id === team.id);
  const isJoining = me.user.teamJoins.some((join) => join.team.id === team.id);

  let action: ActionCTA;
  let type = ActionType.Action;
  let label = `Gérer ${team.actor.name}`;

  if (isMember) {
    action = `/manage/team/${team.actor.slug}`;
  } else {
    if (isJoining) {
      type = ActionType.Info;
      label = 'Adhésion en attente...';
    } else {
      type = ActionType.Primary;
      label = 'Adhérer';
      action = action = () =>
        openBottomSheet({
          node: (
            <FormRenderer
              form={team.joinForm}
              onSubmit={(data) =>
                memberRole
                  ? insertTeamJoin({
                      variables: {
                        object: {
                          askedRoleId: memberRole.id,
                          teamId: team.id,
                          joinedById: me.user.id,
                          formSubmission: { data: { submission: data } },
                        },
                      },
                      onCompleted: ({ insertTeamJoinOne: data }) => {
                        closeBottomSheet();
                        setNotification({ message: 'Votre demande a été envoyée', type: ToastType.Success });
                        mergeCache(
                          { __typename: 'User', id: me.user.id },
                          { fieldName: 'teamJoins', fragmentOn: 'TeamJoin', data },
                        );
                      },
                    })
                  : setNotification({
                      message: `${team.actor.name} n'accepte pas de nouveaux membres pour le moment !`,
                      type: ToastType.Error,
                    })
              }
            />
          ),
        });
    }
  }

  return (
    <ViewLayout hasCta={true}>
      <div className="flex lg-max:flex-col gap-8 lg:items-center lg:gap-24">
        <div className="shrink-0 flex flex-col">
          <div className="text-2xl font-bold text-0 mb-6 flex items-center gap-8">
            <AvatarImage size={32} actor={team.actor} type="team" />
            <div className="flex flex-col gap-2">
              {team?.actor.name}
              <CTAButton className="min-w-[8rem] line-clamp-1" type={type} action={action}>
                {label}
              </CTAButton>
            </div>
          </div>
          {team?.actor.socials.length > 0 && (
            <div className="flex flex-wrap gap-3 items-center">
              {team?.actor.socials.map(
                (social) =>
                  social.url && (
                    <a
                      key={social.id}
                      href={social.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="font-medium"
                    >
                      <SocialIcon
                        className="!h-8 !w-8"
                        small={true}
                        key={social.id}
                        social={social.type as SocialType}
                      />
                    </a>
                  ),
              )}
            </div>
          )}
        </div>
        {/* <div className="w-full flex items-center gap-12">
          <img
            className="w-full aspect-[1.25/1] rounded-lg object-cover"
            src={'https://source.unsplash.com/random/900x900?sig=1'}
          />
          <img
            className="w-full aspect-[1.25/1] rounded-lg object-cover"
            src={'https://source.unsplash.com/random/900x900?sig=2'}
          />
          <img
            className="w-full aspect-[1.25/1] rounded-lg object-cover"
            src={'https://source.unsplash.com/random/900x900?sig=3'}
          />
        </div> */}
      </div>
      <GroupItem heading="Description" groupClassName="text-justify font-medium whitespace-pre-line" className="mt-6">
        {team?.actor.bio}
      </GroupItem>
      {events?.length ? (
        <>
          <hr className="border-[var(--border-2)] my-12" />
          <GroupItem
            heading="Les derniers événements"
            groupClassName="mt-2 w-full grid grid-cols-[repeat(auto-fill,minmax(22rem,1fr))] gap-8"
          >
            {events.map((event) => (
              <EventCard key={event.id} event={event} />
            ))}
          </GroupItem>
        </>
      ) : null}
    </ViewLayout>
  );
}
