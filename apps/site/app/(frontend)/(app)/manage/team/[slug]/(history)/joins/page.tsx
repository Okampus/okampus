'use client';

import AvatarImage from '../../../../../../../../components/atoms/Image/AvatarImage';
import EmptyStateImage from '../../../../../../../../components/atoms/Image/EmptyStateImage';
import FormItem from '../../../../../../../../components/atoms/Item/FormItem';
import FormLayout from '../../../../../../../../components/atoms/Layout/FormLayout';
import ModalLayout from '../../../../../../../../components/atoms/Layout/ModalLayout';
import ViewLayout from '../../../../../../../../components/atoms/Layout/ViewLayout';
import ActionButton from '../../../../../../../../components/molecules/Button/ActionButton';
import FormSubmissionRender from '../../../../../../../../components/organisms/Form/FormSubmissionRender';
import SelectInput from '../../../../../../../../components/molecules/Input/Select/SelectInput';
import SwitchInput from '../../../../../../../../components/molecules/Input/SwitchInput';
import RadioFreeInput from '../../../../../../../../components/molecules/Input/Selector/RadioFreeInput';
import UserLabeled from '../../../../../../../../components/molecules/Labeled/UserLabeled';
import ApprovalDashboard from '../../../../../../../../components/organisms/ApprovalDashboard';
import ChangeSetToast from '../../../../../../../../components/organisms/Form/ChangeSetToast';

import { notificationAtom } from '../../../../../../../../context/global';
import { useTeamManage } from '../../../../../../../../context/navigation';
import { useQueryAndSubscribe } from '../../../../../../../../hooks/apollo/useQueryAndSubscribe';
import { useModal } from '../../../../../../../../hooks/context/useModal';
import { useTranslation } from '../../../../../../../../hooks/context/useTranslation';
// import { useForm } from '../../../../../../../../hooks/form/useForm';

import { GetTeamJoinsDocument, useUpdateTeamJoinMutation, useUpdateTeamMutation } from '@okampus/shared/graphql';
import { ReactComponent as AddUserEmptyState } from '@okampus/assets/svg/empty-state/add-user.svg';

import { ApprovalState, ControlType } from '@okampus/shared/enums';
import { ActionType, ToastType } from '@okampus/shared/types';
// import { extractPositiveNumber } from '@okampus/shared/utils';

import { parsePositiveNumber } from '@okampus/shared/utils';

import { IconHistory } from '@tabler/icons-react';
import { useAtom } from 'jotai';
import { useMemo } from 'react';
import { Controller, useForm } from 'react-hook-form';

import type { GetTeamJoinsQuery, GetTeamJoinsQueryVariables } from '@okampus/shared/graphql';
import type { FormSchema, Submission } from '@okampus/shared/types';

type TeamManageTeamJoinsValues = {
  membershipDuration: string;
  membershipFees: string;
  isJoinFormActive: boolean;
};

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
export default function TeamManageTeamJoinsPage({ params }: { params: { slug: string } }) {
  const { teamManage } = useTeamManage(params.slug);
  const { t } = useTranslation();

  const [, setNotification] = useAtom(notificationAtom);
  const { closeModal, openModal } = useModal();

  const [updateTeamJoin] = useUpdateTeamJoinMutation();
  const [updateTeam] = useUpdateTeamMutation();

  // const [query, setQuery] = useState('');
  // const [selectedStates, setSelectedStates] = useState<ApprovalState[]>([]);

  const archiveDate = useMemo(
    () =>
      teamManage?.teamHistories.sort((a, b) => new Date(b.eventDate).getTime() - new Date(a.eventDate).getTime())[0]
        .eventDate,
    [teamManage?.teamHistories],
  );

  const where = useMemo(() => {
    // const ilike = { _ilike: `%${query}%` };
    // const joinedBy = {
    //   _or: [{ firstName: ilike }, { lastName: ilike }, { user: { actor: { name: ilike, email: ilike } } }],
    // };

    return {
      // ...(selectedStates.length > 0 ? { state: { _in: selectedStates } } : {}),
      // ...(query.length > 0 ? { joinedBy } : {}),
      createdAt: { _gte: archiveDate },
      teamId: { _eq: teamManage?.id },
    };
  }, [archiveDate, teamManage?.id]);

  const { data } = useQueryAndSubscribe<GetTeamJoinsQuery, GetTeamJoinsQueryVariables>({
    query: GetTeamJoinsDocument,
    variables: { where },
  });

  const defaultValues = {
    membershipDuration: teamManage?.membershipDuration ?? '',
    membershipFees: teamManage?.membershipFees.toFixed(2) ?? '',
    isJoinFormActive: teamManage?.isJoinFormActive ?? true,
  };

  const teamJoins = data?.teamJoin;

  const { control, register, reset, handleSubmit, formState } = useForm({
    defaultValues,
  });

  if (!teamManage) return null;

  const onSubmit = handleSubmit((updateData) => {
    const update = {
      ...updateData,
      membershipFees: parsePositiveNumber(updateData.membershipFees) ?? 0,
    };

    updateTeam({ variables: { id: teamManage.id, update }, onCompleted: () => reset({}, { keepValues: true }) });
  });

  const attributedRoleSchema = [
    {
      name: 'role',
      label: 'Rôle attribué',
      type: ControlType.Select,
      options: teamManage.teamRoles.map((role) => ({ label: role.name, value: role.id })),
      required: true,
    },
  ] as const;

  return (
    <ViewLayout header="Adhésions" sidePanelIcon={<IconHistory />}>
      <form onSubmit={onSubmit}>
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
          <FormItem form={teamManage.joinForm} />
        </div>
        <div className="grid xl-max:grid-cols-1 xl:grid-cols-[1.5fr_1fr] gap-6">
          <Controller
            control={control}
            name="membershipFees"
            render={({ field }) => {
              return (
                <RadioFreeInput
                  error={formState.errors.membershipFees?.message}
                  defaultValue={defaultValues.membershipFees}
                  label="Montant de la côtisation"
                  options={feesItems}
                  endContent="€"
                  placeholder="Autre montant"
                  name={field.name}
                  onChange={field.onChange}
                  value={field.value}
                  onBlur={field.onBlur}
                />
              );
            }}
          />
          <Controller
            control={control}
            name="membershipDuration"
            render={({ field }) => {
              return (
                <SelectInput
                  error={formState.errors.membershipDuration?.message}
                  label="Renouvellement des adhésions"
                  options={membershipDurationItems}
                  name={field.name}
                  onChange={field.onChange}
                  value={field.value}
                  onBlur={field.onBlur}
                />
              );
            }}
          />
        </div>
        <ApprovalDashboard
          className="pt-8"
          stateFilter={(join, states) => states.includes(join.state as ApprovalState)}
          searchFilter={(join, query) => {
            const lowerQuery = query.toLowerCase();
            const actor = join.joinedBy.actor;
            return (
              actor.name.toLowerCase().includes(lowerQuery) ||
              actor.email?.toLowerCase().includes(lowerQuery) ||
              join.joinedBy?.firstName.toLowerCase().includes(lowerQuery) ||
              join.joinedBy?.lastName.toLowerCase().includes(lowerQuery)
            );
          }}
          states={Object.values(ApprovalState).map((state) => ({
            label: t(`enums.ApprovalState.${state}`),
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
              content={t(`enums.ApprovalState.${join.state}`)}
            />
          )}
          renderSelected={(join) => (
            <div className="flex flex-col gap-6">
              <div className="flex gap-4 items-center">
                <AvatarImage actor={join.joinedBy.actor} size={18} type="user" />
                <div className="flex flex-col">
                  <div className="text-1 font-semibold text-lg">{join.joinedBy.actor.name}</div>
                  <div className="text-2 text-xs font-medium">{join.joinedBy.actor.email}</div>
                </div>
              </div>
              <hr className="border-color-3" />
              <FormSubmissionRender
                schema={join.formSubmission?.form.schema as FormSchema}
                submission={join.formSubmission?.submission as Submission<FormSchema>}
              />
              <div className="flex text-0 gap-6">
                {join.state === ApprovalState.Pending ? (
                  <>
                    <ActionButton
                      action={{
                        label: 'Accepter la candidature',
                        type: ActionType.Success,
                        linkOrActionOrMenu: () =>
                          openModal({
                            node: (
                              <ModalLayout header="Attribuer un rôle">
                                <FormLayout
                                  schema={attributedRoleSchema}
                                  onSubmit={(values) => {
                                    const update = { state: ApprovalState.Approved, receivedRoleId: values.role };
                                    updateTeamJoin({
                                      variables: { id: join.id, update },
                                      onCompleted: () => {
                                        setNotification({
                                          type: ToastType.Success,
                                          message: `L'adhésion de ${join.joinedBy.actor?.name} a été acceptée !`,
                                        });
                                        closeModal();
                                      },
                                      onError: (error) =>
                                        setNotification({ type: ToastType.Error, message: error.message }),
                                    });
                                  }}
                                />
                              </ModalLayout>
                            ),
                          }),
                      }}
                    />
                    <ActionButton
                      action={{
                        label: 'Refuser',
                        type: ActionType.Danger,
                        linkOrActionOrMenu: () =>
                          updateTeamJoin({
                            variables: { id: join.id, update: { state: ApprovalState.Rejected } },
                            onCompleted: () => {
                              setNotification({
                                type: ToastType.Success,
                                message: `L'adhésion de ${join.joinedBy.actor?.name} a été refusée !`,
                              });
                            },
                            onError: (error) => setNotification({ type: ToastType.Error, message: error.message }),
                          }),
                      }}
                    />
                  </>
                ) : null}
              </div>
            </div>
          )}
          items={teamJoins || []}
          emptyState={
            <EmptyStateImage
              image={<AddUserEmptyState className="max-w-sm" />}
              title="Gérez vos adhésions et invitez de nouveaux membres"
              subtitle="Sélectionner une adhésion sur la gauche pour en voir les détails."
            />
          }
        />
      </form>
    </ViewLayout>
  );
}
