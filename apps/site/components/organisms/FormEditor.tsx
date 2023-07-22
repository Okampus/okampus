'use client';

import BottomSheetLayout from '../atoms/Layout/BottomSheetLayout';

import TabList from '../molecules/List/TabList';
import SelectInput from '../molecules/Input/SelectInput';
import ChangeSetForm from '../molecules/Form/ChangeSetForm';
import FormSchemaRender from '../molecules/Form/FormSchemaRender';
import TextInput from '../molecules/Input/TextInput';
import DragList from '../molecules/List/DragList';
import DragOptionsList from '../molecules/List/DragOptionsList';

import { useBottomSheet } from '../../hooks/context/useBottomSheet';

import { ControlType } from '@okampus/shared/enums';
import { updateFormMutation } from '@okampus/shared/graphql';
import { toSlug } from '@okampus/shared/utils';

import { useMutation } from '@apollo/client';
import { IconCheckupList, IconPlus } from '@tabler/icons-react';

import { useState } from 'react';
import { useKeyPressEvent } from 'react-use';

import type { FormField, SelectItem } from '@okampus/shared/types';
import type { FormBaseInfo } from '@okampus/shared/graphql';

const QUESTIONS = 'Questions';
const PREVIEW = 'Preview';

const option = (idx: number): SelectItem<string> => ({ label: `Option ${idx + 1}`, value: `Option ${idx + 1}` });

export type FormEditorProps = { form: FormBaseInfo };
export default function FormEditor({ form }: FormEditorProps) {
  const { closeBottomSheet } = useBottomSheet();
  const [selectedTab, setSelectedTab] = useState(QUESTIONS);

  useKeyPressEvent('Escape', closeBottomSheet);

  const isOptionType = (type: ControlType) =>
    [ControlType.Radio, ControlType.Select, ControlType.MultiCheckbox].includes(type);

  const tabs = [
    { key: QUESTIONS, label: 'Questions', onClick: () => setSelectedTab(QUESTIONS) },
    { key: PREVIEW, label: 'Prévisualisation', onClick: () => setSelectedTab(PREVIEW) },
  ];

  const controlOptions = [
    { label: 'Texte court', value: ControlType.Text },
    { label: 'Paragraphe', value: ControlType.Markdown },
    { label: 'Fichier', value: ControlType.SingleFile },
    { label: 'Options', value: ControlType.Radio },
    { label: 'Liste déroulante', value: ControlType.Select },
    { label: 'Cases à cocher', value: ControlType.MultiCheckbox },
  ];

  const [updateForm] = useMutation(updateFormMutation);
  const initialState = { fields: (form.schema || []) as FormField[] };

  return (
    <ChangeSetForm
      className="h-full relative flex flex-col"
      checkFields={[]}
      initialValues={initialState}
      onSave={(state) => {
        updateForm({
          // @ts-expect-error - Zeus never type is wrong
          variables: { id: form.id, update: { schema: state.fields } },
        });
      }}
      renderChildren={({ changeValues, values }) => {
        const updateFields = (index: number, newField: FormField) => {
          changeValues((values) => ({
            ...values,
            fields: values.fields?.map((field, i) => (i === index ? newField : field)) ?? [],
          }));
        };

        return (
          <BottomSheetLayout
            topbar={
              <div className="flex gap-4 items-center text-1">
                <IconCheckupList className="w-8 h-8" />
                <div className="text-0 font-semibold text-lg line-clamp-1">{form?.name}</div>
              </div>
            }
            content={
              <div className="h-full w-full flex flex-col">
                <TabList
                  tabs={tabs}
                  selected={selectedTab}
                  className="bg-1 shrink-0"
                  listClassName="justify-center text-sm"
                />
                <div className="grow w-full flex justify-center gap-4 scrollbar overflow-y-scroll">
                  {selectedTab === QUESTIONS ? (
                    <>
                      <DragList
                        className="h-fit pb-40"
                        atLeastOne={true}
                        onChange={(items) => {
                          changeValues((values) => ({ ...values, fields: items.map((item) => item.value) }));
                        }}
                        items={values.fields.map((baseField, idx) => {
                          const field = {
                            ...baseField,
                            ...(isOptionType(baseField.type) &&
                              (!baseField.options || baseField.options.length === 0) && { options: [option(0)] }),
                          };

                          return {
                            value: field,
                            key: idx,
                            label: (
                              <li key={idx} className="card-md flex flex-col gap-2 text-sm">
                                <div className="grid sm:grid-cols-[1fr_12rem] gap-1.5">
                                  <TextInput
                                    options={{ label: 'Question', name: field.name }}
                                    value={baseField.label}
                                    className="grow text-2xl"
                                    onChange={(label) =>
                                      updateFields(idx, { ...baseField, label, name: `${idx}-${toSlug(label)}` })
                                    }
                                  />
                                  <SelectInput
                                    items={controlOptions}
                                    value={field.type}
                                    onChange={(value) =>
                                      updateFields(idx, { ...baseField, type: value, default: undefined })
                                    }
                                    options={{ label: 'Type de champ', name: 'type' }}
                                  />
                                </div>
                                {isOptionType(field.type) ? (
                                  <DragOptionsList
                                    addOption={(index) => option(index)}
                                    onChange={(options) =>
                                      updateFields(idx, {
                                        ...field,
                                        options: options.map((option) => ({
                                          label: option.value,
                                          value: option.value,
                                        })),
                                      })
                                    }
                                    items={
                                      field.options?.map((item, optIdx) => ({
                                        value: item.value,
                                        label: (
                                          <span className="flex items-center gap-2">
                                            {field.type === ControlType.Select ? (
                                              <div className="text-0">{optIdx + 1}.</div>
                                            ) : field.type === ControlType.MultiCheckbox ? (
                                              <input type="checkbox" disabled={true} />
                                            ) : (
                                              <input type="radio" disabled={true} />
                                            )}
                                            <input
                                              className="bg-transparent w-full outline-none hover:border-b focus:border-b active:border-b border-color-3"
                                              value={item.value}
                                              onChange={(e) =>
                                                updateFields(idx, {
                                                  ...field,
                                                  options:
                                                    field.options?.map((option, i) =>
                                                      i === optIdx
                                                        ? { ...option, label: e.target.value, value: e.target.value }
                                                        : option
                                                    ) ?? [],
                                                })
                                              }
                                            />
                                          </span>
                                        ),
                                      })) ?? []
                                    }
                                  />
                                ) : (
                                  <textarea
                                    className="input"
                                    name={`${field.name}-description`}
                                    placeholder="Votre réponse"
                                    value={field.placeholder}
                                    onChange={({ target: { value } }) =>
                                      updateFields(idx, { ...field, placeholder: value })
                                    }
                                  />
                                )}
                              </li>
                            ),
                          };
                        })}
                      />
                      <div
                        className="md-max:absolute md-max:bottom-20 md:sticky md:top-6 bg-2 rounded-xl p-2 h-fit"
                        onClick={(e) => e.stopPropagation()}
                      >
                        <IconPlus
                          className="w-8 h-8 cursor-pointer text-1"
                          onClick={() => {
                            changeValues(({ fields }) => ({
                              ...values,
                              fields: [
                                ...(fields ?? []),
                                {
                                  label: 'Question',
                                  name: `${fields.length ?? 0}-question`,
                                  type: ControlType.Text,
                                  isRequired: false,
                                  options: [],
                                },
                              ],
                            }));
                          }}
                        />
                      </div>
                    </>
                  ) : (
                    <FormSchemaRender className="my-5" schema={values.fields} disabled={true} />
                  )}
                </div>
              </div>
            }
          />
        );
      }}
    />
  );
}
