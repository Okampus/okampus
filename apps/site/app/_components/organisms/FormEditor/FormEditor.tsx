'use client';

import FormSchemaRender from '../Form/FormSchemaRender';
import TabList from '../../molecules/List/TabList';
import SelectInput from '../../molecules/Input/Controlled/Select/SelectInput';
import TextInput from '../../molecules/Input/Uncontrolled/String/TextInput';

import { useBottomSheet } from '../../../_hooks/context/useBottomSheet';

import DragListItem from '../../molecules/List/DragListItem';
import ChangeSetToast from '../Form/ChangeSetToast';
import OptionListItem from '../../molecules/List/OptionListItem';
// import { useUpdateFormMutation } from '@okampus/shared/graphql';

import { ControlType } from '@okampus/shared/enums';
import { moveImmutable, setAtIndexImmutable, uniqueSlug } from '@okampus/shared/utils';

import { Plus } from '@phosphor-icons/react';

import { useState } from 'react';
import { useKeyPressEvent } from 'react-use';

import { DragDropContext, Droppable, Draggable } from 'react-beautiful-dnd';
import { useForm } from 'react-hook-form';

import type { FormMinimal } from '../../../../types/prisma/Form/form-minimal';
import type { FormFieldType, FormSchema, FormFieldOption } from '@okampus/shared/types';

const QUESTIONS = 'Questions';
const PREVIEW = 'Preview';

const newOption = (idx: number): FormFieldOption => ({ label: `Option ${idx + 1}`, value: `Option ${idx + 1}` });
const newQuestion = (idx: number): FormFieldType<ControlType.Text> => ({
  label: `Question #${idx + 1}`,
  name: uniqueSlug('field'),
  type: ControlType.Text,
  required: false,
});

const controlOptions = [
  { label: 'Texte court', value: ControlType.Text },
  { label: 'Paragraphe', value: ControlType.Markdown },
  { label: 'Fichier', value: ControlType.File },
  { label: 'Options', value: ControlType.Radio },
  { label: 'Liste déroulante', value: ControlType.Select },
  { label: 'Cases à cocher', value: ControlType.MultiCheckbox },
];

function OptionPrefix({ type, index }: { type: ControlType; index: number }) {
  if (type === ControlType.Select) return <div className="text-0 tabular-nums">{index + 1}.</div>;
  if (type === ControlType.Radio) return <input type="radio" disabled={true} />;
  if (type === ControlType.MultiCheckbox) return <input type="checkbox" disabled={true} />;
  return null;
}

export type FormEditorProps = { form: FormMinimal; name: string };
export default function FormEditor({ form, name }: FormEditorProps) {
  const [selectedTab, setSelectedTab] = useState(QUESTIONS);
  const tabs = [
    { key: QUESTIONS, label: 'Questions', onClick: () => setSelectedTab(QUESTIONS) },
    { key: PREVIEW, label: 'Prévisualisation', onClick: () => setSelectedTab(PREVIEW) },
  ];

  // const [updateForm] = useUpdateFormMutation();

  const { closeBottomSheet } = useBottomSheet();
  useKeyPressEvent('Escape', closeBottomSheet);

  // TODO: enforce schema type a bit more
  // const defaultFields: FormSchema = Array.isArray(form.schema) ? form.schema : [];
  const defaultFields: FormSchema = [];
  const { register, formState, watch, reset, setValue, control, handleSubmit } = useForm({
    defaultValues: { fields: defaultFields },
    mode: 'all',
  });

  const fields = watch('fields');
  const updateFields = (index: number, field: FormFieldType<ControlType>) => {
    setValue('fields', setAtIndexImmutable(fields, index, field), { shouldDirty: true });
  };
  // setState((fields) => setAtIndexImmutable(fields, idx, field));
  // const [errors, setErrors] = useImmer<Record<string, string>>({});
  const onSubmit = handleSubmit(
    () => {},
    // updateForm({
    //   variables: { id: form.id, update: { schema: fields } },
    //   onCompleted: () => {
    //     reset({}, { keepValues: true });
    //   },
    // }),
  );

  //   <div className="flex gap-4 items-center text-1">
  //   <ClipboardText className="w-8 h-8" />
  //   <div className="text-0 font-semibold text-lg line-clamp-1">{name}</div>
  // </div>

  return (
    <div className="h-full w-full flex flex-col">
      <TabList tabs={tabs} selected={selectedTab} className="bg-1 shrink-0" listClassName="justify-center text-sm" />
      <div className="grow w-full flex justify-center gap-4 scrollbar overflow-y-scroll">
        {selectedTab === QUESTIONS ? (
          <form className="mt-8 w-full flex gap-12 justify-center" onSubmit={onSubmit}>
            <ChangeSetToast
              isDirty={formState.isDirty}
              isValid={formState.isValid}
              isLoading={formState.isSubmitting}
              onCancel={() => reset({ fields: defaultFields })}
            />
            <DragDropContext
              onDragEnd={({ source, destination }) => {
                destination &&
                  setValue('fields', moveImmutable(fields, source.index, destination.index), { shouldDirty: true });
              }}
            >
              <Droppable droppableId="fields">
                {(provided) => (
                  <ul
                    {...provided.droppableProps}
                    ref={provided.innerRef}
                    className="mb-[calc(2.5*var(--h-topbar))] w-full max-w-4xl"
                  >
                    {fields.map((field, idx) => {
                      const options = field.options ?? [newOption(0)];
                      const optionPrefix = <OptionPrefix type={field.type} index={idx} />;

                      return (
                        <Draggable key={`field.${idx}`} draggableId={`field.${idx}`} index={idx}>
                          {(provided) => (
                            <DragListItem
                              className="flex flex-col md-max:gap-2"
                              ref={provided.innerRef}
                              draggrableProps={provided.draggableProps}
                              handleProps={provided.dragHandleProps}
                              onDelete={
                                idx === 0
                                  ? undefined
                                  : () => {
                                      const fieldsAfterDelete = fields.filter((_, index) => index !== idx);
                                      setValue('fields', fieldsAfterDelete, { shouldDirty: true });
                                    }
                              }
                            >
                              <div className="grid md:grid-cols-[1fr_12rem] gap-1.5">
                                <TextInput
                                  label="Question"
                                  name={`fields.${idx}.label`}
                                  error={formState.errors['fields']?.[idx]?.label?.message ?? null}
                                  className="grow text-2xl"
                                />

                                <SelectInput
                                  options={controlOptions}
                                  label="Type de champ"
                                  control={control}
                                  name={`fields.${idx}.type`}
                                />
                              </div>
                              {optionPrefix ? (
                                <>
                                  <DragDropContext
                                    onDragEnd={({ source, destination }) => {
                                      destination &&
                                        updateFields(idx, {
                                          ...field,
                                          options: moveImmutable(options, source.index, destination.index),
                                        });
                                    }}
                                  >
                                    <Droppable droppableId={`field-${idx}-options`}>
                                      {(provided) => (
                                        <ul className="mt-2" {...provided.droppableProps} ref={provided.innerRef}>
                                          {options.map((option, optionIdx) => {
                                            return (
                                              <Draggable
                                                key={`field.${idx}.option.${optionIdx}`}
                                                draggableId={`field-${idx}-option-${optionIdx}`}
                                                index={optionIdx}
                                              >
                                                {(provided) => (
                                                  <OptionListItem
                                                    ref={provided.innerRef}
                                                    draggrableProps={provided.draggableProps}
                                                    handleProps={provided.dragHandleProps}
                                                    onDelete={
                                                      optionIdx > 0 &&
                                                      (() => {
                                                        const options = fields[idx].options ?? [newOption(0)];
                                                        setValue(
                                                          'fields',
                                                          setAtIndexImmutable(fields, idx, {
                                                            ...fields[idx],
                                                            options: options.filter((_, index) => index !== optionIdx),
                                                          }),
                                                          { shouldDirty: true },
                                                        );
                                                      })
                                                    }
                                                  >
                                                    <span className="flex items-center gap-2 w-full">
                                                      {optionPrefix}
                                                      <input
                                                        className="bg-transparent w-full outline-none border-b border-transparent hover:border-[var(--border-3)] active:border-[var(--border-3)] focus:border-[var(--border-3)]"
                                                        value={option.value}
                                                        onChange={(e) => {
                                                          const newOptions = setAtIndexImmutable(options, optionIdx, {
                                                            ...option,
                                                            label: e.target.value,
                                                            value: e.target.value,
                                                          });
                                                          updateFields(idx, { ...field, options: newOptions });
                                                        }}
                                                      />
                                                    </span>
                                                  </OptionListItem>
                                                )}
                                              </Draggable>
                                            );
                                          })}
                                        </ul>
                                      )}
                                    </Droppable>
                                  </DragDropContext>
                                  <span className="flex items-center gap-2 pl-6">
                                    {optionPrefix}
                                    <span
                                      className="border-b border-transparent hover:border-[var(--border-3)] w-full cursor-text mr-2"
                                      onClick={() => {
                                        const options = fields[idx].options ?? [newOption(0)];
                                        const newOptions = [...options, newOption(options.length)];
                                        setValue(
                                          'fields',
                                          setAtIndexImmutable(fields, idx, { ...field, options: newOptions }),
                                          { shouldDirty: true },
                                        );
                                      }}
                                    >
                                      Ajouter une option
                                    </span>
                                  </span>
                                </>
                              ) : (
                                <textarea
                                  className="input !h-fit !max-h-40 resize-none mt-4"
                                  name={`fields.${idx}.placeholder`}
                                  placeholder="Texte indicatif de la question (optionnel)"
                                  value={field.placeholder}
                                  onChange={({ target: { value } }) =>
                                    updateFields(idx, { ...field, placeholder: value })
                                  }
                                />
                              )}
                            </DragListItem>
                          )}
                        </Draggable>
                      );
                    })}
                  </ul>
                )}
              </Droppable>
            </DragDropContext>
            <div
              className="md-max:absolute md-max:bottom-[calc(3*var(--h-topbar))] md-max:right-[var(--px-content)] md:sticky md:top-6 bg-[var(--primary)] text-white rounded-full p-2 h-fit "
              onClick={(e) => {
                e.stopPropagation();
                setValue('fields', [...fields, newQuestion(fields.length)], { shouldDirty: true });
              }}
            >
              <Plus className="w-8 h-8 cursor-pointer" />
            </div>
          </form>
        ) : (
          <FormSchemaRender className="my-5" schema={defaultFields} disabled={true} />
        )}
      </div>
    </div>
  );
}
