import { ReactComponent as ArrowLeftIcon } from '@okampus/assets/svg/icons/arrow-left.svg';
import { ReactComponent as CloseFilledIcon } from '@okampus/assets/svg/icons/close.svg';
import { ReactComponent as FormOutlinedIcon } from '@okampus/assets/svg/icons/material/outlined/form.svg';
import { ReactComponent as PlusFilledIcon } from '@okampus/assets/svg/icons/material/filled/add.svg';

import { ControlType } from '@okampus/shared/enums';
import { formBaseInfo, updateFormBase, useTypedQuery } from '@okampus/shared/graphql';
import { ActionType } from '@okampus/shared/types';
import { toSlug } from '@okampus/shared/utils';

import { NavigationContext } from '@okampus/ui/hooks';
import { ActionButton, SelectInput, TabsList } from '@okampus/ui/molecules';

import { useContext, useState } from 'react';
import { useKeyPressEvent } from 'react-use';
import { AnimatePresence, motion } from 'framer-motion';
import { useMutation } from '@apollo/client';

import type { FormField, SelectItem } from '@okampus/shared/types';

export type FormEditViewProps = { id: string };

const QUESTIONS = 'questions';
const ANSWERS = 'answers';

const option = (idx: number): SelectItem<string> => ({ label: `Option ${idx + 1}`, value: `Option ${idx + 1}` });

export function FormEditView({ id }: FormEditViewProps) {
  const [fields, setFields] = useState<FormField[] | null>(null);
  const [updateForm] = useMutation(updateFormBase);
  // const [insertFormEdit] = useMutation(insertFormEditBase);

  const { hideOverlay } = useContext(NavigationContext);

  const [selectedTab, setSelectedTab] = useState(QUESTIONS);
  const [isDirty, setIsDirty] = useState(false);

  useKeyPressEvent('Escape', () => hideOverlay());

  const setDirty = () => !isDirty && setIsDirty(true);
  const isOptionType = (type: ControlType) =>
    [ControlType.Radio, ControlType.Select, ControlType.MultiCheckbox].includes(type);

  const updateFields = (index: number, newField: FormField) => {
    setDirty();
    setFields((fields) => fields?.map((field, i) => (i === index ? newField : field)) ?? []);
  };
  const updateOptions = (field: FormField, index: number, value: string): FormField => ({
    ...field,
    options: field.options?.map((option, i) => (i === index ? { label: value, value } : option)) ?? [],
  });

  const tabs = [
    { key: QUESTIONS, label: 'Questions', onClick: () => setSelectedTab(QUESTIONS) },
    { key: ANSWERS, label: 'Réponses', content: <div>Réponses</div>, onClick: () => setSelectedTab(ANSWERS) },
  ];

  const controlOptions = [
    { label: 'Texte court', value: ControlType.Text },
    { label: 'Paragraphe', value: ControlType.Markdown },
    { label: 'Fichier', value: ControlType.SingleFile },
    { label: 'Options', value: ControlType.Radio },
    { label: 'Liste déroulante', value: ControlType.Select },
    { label: 'Cases à cocher', value: ControlType.MultiCheckbox },
  ];

  const { data } = useTypedQuery({ form: [{ where: { id: { _eq: id } }, limit: 1 }, formBaseInfo] });

  const form = data?.form?.[0];
  const initialFields = (form?.schema ?? null) as FormField[] | null;

  if (!fields && initialFields) setFields(initialFields);

  return (
    <div className="h-full w-full text-1">
      <div
        className="h-[var(--topbar-height)] w-full px-7 flex justify-between text-0 items-center from-[#000000ee] to-transparent bg-gradient-to-b"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex gap-6 items-center text-gray-200">
          <ArrowLeftIcon onClick={() => hideOverlay()} className="cursor-pointer" height="30" />
          <FormOutlinedIcon className="h-12" />
          <div className="text-xl font-medium">{form?.name}</div>
        </div>
        <AnimatePresence>
          {isDirty && (
            <motion.div
              className="flex gap-6 items-center rounded-xl px-6 py-3 bg-1"
              initial={{ scale: 0.8, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
            >
              <div>Attention - vous avez des modifications non sauvegardées !</div>
              <div
                className="text-red-500 font-semibold ml-6 hover:underline cursor-pointer"
                onClick={() => {
                  setFields(initialFields);
                  setIsDirty(false);
                }}
              >
                Annuler
              </div>
              <ActionButton
                small={true}
                action={{
                  type: ActionType.Success,
                  label: 'Enregistrer',
                  linkOrActionOrMenu: () => {
                    // insertFormEdit({
                    //   variables: {
                    //     object: {
                    //       createdById: currentUser?.individual?.id,
                    //       tenantId: currentUser?.tenantId,
                    //       formId: id,
                    //       newVersion: fields,
                    //     },
                    //   },
                    // });
                    updateForm({
                      // @ts-expect-error - Zeus is not able to infer the type of the mutation
                      variables: { id, update: { schema: fields } },
                      onCompleted: () => setIsDirty(false),
                    });
                  },
                }}
              />
            </motion.div>
          )}
        </AnimatePresence>
      </div>
      <div className="w-full flex justify-center h-[3rem] text-gray-300" onClick={(e) => e.stopPropagation()}>
        <TabsList
          tabs={tabs}
          selected={selectedTab}
          isSmall={true}
          listClassName="justify-center"
          tabClassName="text-white"
        />
      </div>
      <div className="h-[calc(100%-(3rem+var(--topbar-height)))]  w-full">
        {form ? (
          <div className="flex gap-8 justify-center h-full w-full overflow-y-scroll scrollbar">
            <ul className="pt-8 w-[54rem] relative" onClick={(e) => e.stopPropagation()}>
              {fields?.map((baseField, idx) => {
                const field = {
                  ...baseField,
                  options: baseField.options && baseField.options.length > 0 ? baseField.options : [option(0)],
                };

                return (
                  <li className="card-md bg-2 flex flex-col gap-2 text-lg mb-8">
                    <div className="flex gap-6">
                      <input
                        name={field.name}
                        value={field.label}
                        className="input grow text-2xl"
                        onChange={({ target: { value } }) =>
                          updateFields(idx, { ...field, label: value, name: `${idx}-${toSlug(value)}` })
                        }
                      />
                      <SelectInput
                        items={controlOptions}
                        value={field.type}
                        onChange={(value) => updateFields(idx, { ...field, type: value, default: undefined })}
                        options={{ label: 'Type de champ', name: 'type' }}
                      />
                    </div>
                    {isOptionType(field.type) ? (
                      <div className="flex flex-col gap-3">
                        {field.options.map((option, optIdx) => (
                          <div className="flex gap-2 items-center">
                            {field.type === ControlType.Select ? (
                              <div className="text-0">{optIdx + 1}.</div>
                            ) : field.type === ControlType.MultiCheckbox ? (
                              <input type="checkbox" disabled={true} />
                            ) : (
                              <input type="radio" disabled={true} />
                            )}
                            <input
                              name={`${field.name}-option-${optIdx}`}
                              value={option.value}
                              className="input grow"
                              onChange={({ target: { value } }) =>
                                updateFields(idx, updateOptions(field, optIdx, value))
                              }
                            />
                            {field.options.length > 1 && (
                              <CloseFilledIcon
                                className="w-8 h-8 text-2 cursor-pointer"
                                onClick={() =>
                                  updateFields(idx, {
                                    ...field,
                                    options: field.options.filter((_, i) => i !== optIdx),
                                  })
                                }
                              />
                            )}
                          </div>
                        ))}
                        <div className="flex gap-2">
                          {field.type === ControlType.Select ? (
                            <div className="text-0">{field.options.length + 1}.</div>
                          ) : field.type === ControlType.MultiCheckbox ? (
                            <input type="checkbox" disabled={true} />
                          ) : (
                            <input type="radio" disabled={true} />
                          )}
                          <div
                            className="grow text-2 input"
                            onClick={() =>
                              updateFields(idx, {
                                ...field,
                                options: [...(field.options ?? []), option(field.options.length ?? 1)],
                              })
                            }
                          >
                            Ajouter une option
                          </div>
                        </div>
                      </div>
                    ) : (
                      <textarea
                        name={`${field.name}-description`}
                        placeholder="Votre réponse"
                        value={field.placeholder}
                        onChange={({ target: { value } }) => {
                          setDirty();
                          setFields([
                            ...fields.slice(0, idx),
                            { ...field, placeholder: value },
                            ...fields.slice(idx + 1),
                          ]);
                        }}
                        className="input"
                      />
                    )}
                  </li>
                );
              })}
            </ul>
            <div className="sticky top-8 bg-2 rounded-xl p-3 h-fit" onClick={(e) => e.stopPropagation()}>
              <PlusFilledIcon
                className="w-10 h-10 p-1 rounded-full cursor-pointer text-0"
                onClick={() => {
                  setDirty();
                  setFields([
                    ...(fields ?? []),
                    {
                      label: 'Question',
                      name: `${fields?.length ?? 0}-question`,
                      type: ControlType.Text,
                      isRequired: false,
                      options: [],
                    },
                  ]);
                }}
              />
            </div>
          </div>
        ) : (
          <div>Loading...</div>
        )}
      </div>
    </div>
  );
}
