import AddItem from '../../../../../../../../_components/atoms/Item/AddItem';
import AvatarImage from '../../../../../../../../_components/atoms/Image/AvatarImage';
import EmptyStateImage from '../../../../../../../../_components/atoms/Image/EmptyStateImage';
import FormItem from '../../../../../../../../_components/atoms/Item/FormItem';
import BaseView from '../../../../../../../../_components/templates/BaseView';
import Button from '../../../../../../../../_components/molecules/Button/Button';
import FormSubmissionRender from '../../../../../../../../_components/organisms/Form/FormSubmissionRender';
import SelectInput from '../../../../../../../../_components/molecules/Input/Controlled/Select/SelectInput';
import SwitchInput from '../../../../../../../../_components/molecules/Input/Uncontrolled/Boolean/SwitchInput';
import SelectorWithOther from '../../../../../../../../_components/molecules/Input/Controlled/Select/SelectorWithOther';
import UserLabeled from '../../../../../../../../_components/molecules/Labeled/UserLabeled';
import ApprovalDashboard from '../../../../../../../../_components/organisms/ApprovalDashboard';
import ChangeSetToast from '../../../../../../../../_components/organisms/Form/ChangeSetToast';

import prisma from '../../../../../../../../../database/prisma/db';

import { teamMemberMinimal } from '../../../../../../../../../types/prisma/TeamMember/team-member-minimal';
import { formMinimal } from '../../../../../../../../../types/prisma/Form/form-minimal';
import { teamJoinMinimal } from '../../../../../../../../../types/prisma/TeamJoin/team-join-minimal';
import { teamRoleMinimal } from '../../../../../../../../../types/prisma/TeamRole/team-role-minimal';
import { actorWithTags } from '../../../../../../../../../types/prisma/Actor/actor-with-tags';

import { ReactComponent as AddUserEmptyState } from '@okampus/assets/svg/empty-state/add-user.svg';

import { ActionType, ControlType } from '@okampus/shared/enums';
import { parsePositiveNumber } from '@okampus/shared/utils';

import { ClockCounterClockwise } from '@phosphor-icons/react/dist/ssr';
import { ApprovalState } from '@prisma/client';

import { notFound } from 'next/navigation';
import { getTranslations } from 'next-intl/server';
import { useForm } from 'react-hook-form';

import type { FormSchema, SubmissionType } from '@okampus/shared/types';
import type { DomainSlugParams } from '../../../../../../../../params.type';

const membershipDurationItems = [
  { label: 'Tous les 6 mois', value: 'P6M' },
  { label: 'Tous les ans', value: 'P1Y' },
  { label: 'Jamais', value: '' },
];

const feesItems = [
  { label: 'Gratuit', value: '0.00' },
  { label: '5€', value: '5.00' },
  { label: '10€', value: '10.00' },
  { label: '15€', value: '15.00' },
];

// TODO: manage archives
export default async function TeamManageTeamJoinsPage({ params }: DomainSlugParams) {
  const teamManage = await prisma.team.findFirst({
    where: { slug: params.slug, tenantScope: { domain: params.domain } },
    select: {
      teamMembers: teamMemberMinimal,
      isJoinFormActive: true,
      joinForm: formMinimal,
      membershipDuration: true,
      membershipFees: true,
      teamJoins: teamJoinMinimal,
      teamRoles: teamRoleMinimal,
      actor: actorWithTags,
    },
  });
  const t = await getTranslations();
  // const { closeModal, openModal } = useModal();

  // const [updateTeamJoin] = useUpdateTeamJoinMutation();
  // const [updateTeam] = useUpdateTeamMutation();

  // const [query, setQuery] = useState('');
  // const [selectedStates, setSelectedStates] = useState<ApprovalState[]>([]);

  // const archiveDate = useMemo(
  //   () =>
  //     teamManage.teamHistories.sort((a, b) => new Date(b.happenedAt).getTime() - new Date(a.happenedAt).getTime())[0]
  //       .happenedAt,
  //   [teamManage.teamHistories],
  // );

  if (!teamManage) notFound();

  // TODO: proper where everywhere with "archive" date
  // const where = useMemo(() => {
  //   // const ilike = { _ilike: `%${query}%` };
  //   // const joinedBy = {
  //   //   _or: [{ firstName: ilike }, { lastName: ilike }, { user: { actor: { name: ilike, email: ilike } } }],
  //   // };

  //   return {
  //     // ...(selectedStates.length > 0 ? { state: { _in: selectedStates } } : {}),
  //     // ...(query.length > 0 ? { joinedBy } : {}),
  //     createdAt: { _gte: archiveDate },
  //     teamId: { _eq: teamManage.id },
  //   };
  // }, [archiveDate, teamManage.id]);

  // const { data } = useQueryAndSubscribe<GetTeamJoinsQuery, GetTeamJoinsQueryVariables>({
  //   query: GetTeamJoinsDocument,
  //   variables: { where },
  // });

  const defaultValues = {
    membershipDuration: teamManage.membershipDuration ?? '',
    membershipFees: teamManage.membershipFees.toFixed(2) ?? '',
    isJoinFormActive: teamManage.isJoinFormActive ?? true,
  };

  const { control, register, reset, handleSubmit, formState } = useForm({ defaultValues });

  if (!teamManage) return null;

  const onSubmit = handleSubmit((updateData) => {
    const update = {
      ...updateData,
      membershipFees: parsePositiveNumber(updateData.membershipFees) ?? 0,
    };

    // TODO: update team
    // updateTeam({ variables: { id: teamManage.id, update }, onCompleted: () => reset({}, { keepValues: true }) });
  });

  const attributedRoleSchema = [
    {
      name: 'role',
      label: 'Rôle attribué',
      type: ControlType.Select,
      options: teamManage.teamRoles.map((role) => ({ label: role.name, value: role.id })),
      required: true,
    },
  ];

  return (
    <BaseView header="Adhésions" sidePanelButton={<ClockCounterClockwise className="h-7 w-7" />}>
      <form
      // TODO: alternative for changeSetForms
      // onSubmit={onSubmit}
      >
        <ChangeSetToast
          isDirty={formState.isDirty}
          isValid={formState.isValid}
          isLoading={formState.isSubmitting}
          onCancel={() => reset(defaultValues)}
        />
        <SwitchInput
          {...register('isJoinFormActive')}
          label="Formulaire d'adhésion activé ?"
          description="Si le formulaire est désactivé, les adhérents candidateront à l'équipe en un clic, sans remplir de formulaire."
        />
        <div className="my-6">
          {teamManage.joinForm ? (
            <FormItem form={teamManage.joinForm} name={`Formulaire d'adhésion / ${teamManage.actor.name}`} />
          ) : (
            <AddItem label="Ajouter un formulaire" onClick={() => {}} />
            // TODO: add add form modal
          )}
        </div>
        <div className="grid xl-max:grid-cols-1 xl:grid-cols-[1.5fr_1fr] gap-6">
          <SelectorWithOther
            // error={formState.errors.membershipFees.message}
            // defaultValue={defaultValues.membershipFees}
            label="Montant de la côtisation"
            options={feesItems}
            end="€"
            placeholder="Autre montant"
            name="membershipFees"
            control={control}
          />
          <SelectInput
            // error={formState.errors.membershipDuration.message}
            label="Renouvellement des adhésions"
            name="membershipDuration"
            options={membershipDurationItems}
            control={control}
          />
        </div>
        <ApprovalDashboard
          className="pt-8"
          stateFilter={(join, states) => states.includes(join.state)}
          searchFilter={(join, query) => {
            const lowerQuery = query.toLowerCase();
            const actor = join.joinedBy.actor;
            return (
              actor.name.toLowerCase().includes(lowerQuery) ||
              actor.email?.toLowerCase().includes(lowerQuery) ||
              join.joinedBy.firstName.toLowerCase().includes(lowerQuery) ||
              join.joinedBy.lastName.toLowerCase().includes(lowerQuery)
            );
          }}
          states={Object.values(ApprovalState).map((state) => ({
            label: t(`Enums.ApprovalState.${state}`),
            value: state,
          }))}
          renderHeader={(join) => (
            <div className="flex items-center gap-2.5 text-0">
              Adhésion de <UserLabeled user={join.joinedBy} small={true} />
            </div>
          )}
          renderItem={(join) => (
            <UserLabeled
              showCardOnClick={false}
              user={join.joinedBy}
              content={t(`Enums.ApprovalState.${join.state}`)}
            />
          )}
          renderSelected={(join) => (
            <div className="flex flex-col gap-6">
              <div className="flex gap-4 items-center">
                <AvatarImage actor={join.joinedBy.actor} size={18} />
                <div>
                  <div className="text-1 font-semibold text-lg">{join.joinedBy.actor.name}</div>
                  <div className="text-2 text-xs font-medium">{join.joinedBy.actor.email}</div>
                </div>
              </div>
              <hr className="border-[var(--border-3)]" />
              {teamManage.joinForm && join.joinFormSubmission && (
                <FormSubmissionRender
                  schema={teamManage.joinForm.schema as FormSchema}
                  submission={join.joinFormSubmission.submission as SubmissionType<FormSchema>}
                />
              )}
              <div className="flex text-0 gap-6">
                {join.state === ApprovalState.Pending ? (
                  <>
                    <Button
                      type={ActionType.Success}
                      // action={{
                      //   label: 'Accepter la candidature',
                      //   action={() => {}}
                      //   // openModal({
                      //   //   node: (
                      //   //     <ModalLayout header="Attribuer un rôle">
                      //   //       <FormLayout
                      //   //         schema={attributedRoleSchema}
                      //   //         onSubmit={(values) => {
                      //   //           const update = { state: ApprovalState.Approved, receivedRoleId: values.role };
                      //   //           updateTeamJoin({
                      //   //             variables: { id: join.id, update },
                      //   //             onCompleted: () => {
                      //   //               setNotification({
                      //   //                 type: ToastType.Success,
                      //   //                 message: `L'adhésion de ${join.joinedBy.actor.name} a été acceptée !`,
                      //   //               });
                      //   //               closeModal();
                      //   //             },
                      //   //             onError: (error) =>
                      //   //               setNotification({ type: ToastType.Error, message: error.message }),
                      //   //           });
                      //   //         }}
                      //   //       />
                      //   //     </ModalLayout>
                      //   //   ),
                      //   // }),
                      // }}
                    >
                      Accepter la candidature
                    </Button>
                    <Button
                      type={ActionType.Danger}
                      // action={{
                      //   label: 'Refuser',
                      //   action={() => {}}
                      //   // updateTeamJoin({
                      //   //   variables: { id: join.id, update: { state: ApprovalState.Rejected } },
                      //   //   onCompleted: () => {
                      //   //     setNotification({
                      //   //       type: ToastType.Success,
                      //   //       message: `L'adhésion de ${join.joinedBy.actor.name} a été refusée !`,
                      //   //     });
                      //   //   },
                      //   //   onError: (error) => setNotification({ type: ToastType.Error, message: error.message }),
                      //   // }),
                      // }}
                    >
                      Refuser
                    </Button>
                  </>
                ) : null}
              </div>
            </div>
          )}
          items={teamManage.teamJoins || []}
          emptyState={
            <EmptyStateImage
              image={<AddUserEmptyState className="max-w-sm" />}
              title="Gérez vos adhésions et invitez de nouveaux membres"
              subtitle="Sélectionner une adhésion sur la gauche pour en voir les détails."
            />
          }
        />
      </form>
    </BaseView>
  );
}
