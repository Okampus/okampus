import SocialIcon from '../atoms/Icon/SocialIcon';
import GroupItem from '../atoms/Item/GroupItem';
import TextInput from '../molecules/Input/TextInput';

import { validateDiscordInvite } from '../../utils/form-validation/discord-invite';
import { useAsyncValidation } from '../../hooks/useAsyncValidation';
import { useTranslation } from '../../hooks/context/useTranslation';

import ChangeSetToast from '../organisms/Form/ChangeSetToast';

import DragListItem from '../molecules/List/DragListItem';
import { SocialType } from '@okampus/shared/enums';
import { debounce, moveImmutable, setAtIndexImmutable } from '@okampus/shared/utils';

import { DragDropContext, Droppable, Draggable } from 'react-beautiful-dnd';
import { useForm } from 'react-hook-form';

import { useEffect, useMemo } from 'react';

import type { OnDragEndResponder } from 'react-beautiful-dnd';
import type { SocialInfo } from '../../types/features/social.info';

export type SocialsFormProps = {
  className?: string;
  initialSocials: SocialInfo[];
  onChangeSocials?: (socials: SocialInfo[]) => void;
  onSubmit: (socials: SocialInfo[], callback?: () => void) => void;
};

const debouncedValidateDiscordInvite = debounce(validateDiscordInvite, 200);

export default function SocialsForm({ className, initialSocials, onChangeSocials, onSubmit }: SocialsFormProps) {
  const { format } = useTranslation();

  const { validate, loading, errors, infos, resetValidation } = useAsyncValidation();

  const defaultValues = useMemo(() => ({ socials: initialSocials }), [initialSocials]);
  const { register, trigger, formState, watch, reset, setValue } = useForm({ defaultValues, mode: 'all' });

  const socials = watch('socials');
  useEffect(() => {
    onChangeSocials?.(socials);
  }, [onChangeSocials, reset, socials]);

  const addableSocials = Object.values(SocialType).filter((value) => !socials.some((social) => social.type === value));

  const handleDrag: OnDragEndResponder = ({ source: { index: from }, destination }) => {
    if (destination) {
      const change = moveImmutable(socials, from, destination.index).map((value, idx) => ({ ...value, order: idx }));
      setValue('socials', change, { shouldDirty: true });
      setTimeout(trigger, 100);
    }
  };

  const update = (index: number, value: SocialInfo) => {
    setValue('socials', setAtIndexImmutable(socials, index, value), { shouldDirty: true });
  };

  return (
    <form
      className={className}
      onSubmit={(event) => {
        event.preventDefault();
        onSubmit(socials, () => {
          reset({}, { keepValues: true });
        });
      }}
    >
      <ChangeSetToast
        changed={formState.isDirty}
        errors={{
          ...errors,
          ...formState.errors,
        }}
        loading={loading}
        onCancel={() => {
          reset({ socials: initialSocials });
          resetValidation();
        }}
      />
      {addableSocials.length > 0 && (
        <GroupItem className="bg-2 p-4 md:rounded-2xl mb-6" heading="Ajouter des réseaux à votre profil">
          <div className="text-xs">Cliquez sur un réseau pour ajouter un lien qui apparaîtra sur votre profil.</div>
          <span className="flex gap-4 items-center flex-wrap">
            {addableSocials.map((value) => (
              <SocialIcon
                className="shrink-0 bg-3"
                key={value}
                social={value}
                onClick={() => {
                  // const shiftedSocials = fields.map((social) => ({ ...social, order: social.order + 1 }));
                  setValue(
                    'socials',
                    [
                      { type: value, url: '', pseudo: '', order: 0 },
                      ...socials.map((social) => ({ ...social, order: social.order + 1 })),
                    ],
                    { shouldDirty: true },
                  );
                  setTimeout(trigger, 100);
                }}
              />
            ))}
          </span>
        </GroupItem>
      )}
      <DragDropContext onDragEnd={handleDrag}>
        <Droppable droppableId="socials">
          {(provided) => (
            <ul {...provided.droppableProps} ref={provided.innerRef}>
              {socials.map((field, idx) => {
                const error = formState.errors.socials?.[idx]?.pseudo;
                return (
                  <Draggable key={`socials.${idx}`} draggableId={`social-${idx}`} index={idx}>
                    {(provided) => (
                      <DragListItem
                        className="flex flex-col md-max:gap-2"
                        ref={provided.innerRef}
                        draggrableProps={provided.draggableProps}
                        handleProps={provided.dragHandleProps}
                        onDelete={() => {
                          setValue(
                            'socials',
                            socials
                              .filter((_, index) => index !== idx)
                              .map((value, index) => ({ ...value, order: index })),
                            { shouldDirty: true },
                          );
                          if (field.type === SocialType.Discord) resetValidation();
                          setTimeout(trigger, 100);
                        }}
                      >
                        <div className="flex gap-4">
                          <SocialIcon social={field.type as SocialType} />
                          <div className="!text-lg label-title mt-2">
                            {field.type} {field.pseudo ? `• ${field.pseudo}` : ''}
                          </div>
                        </div>
                        <div className="px-1 md:pl-16">
                          {field.type === SocialType.Discord ? (
                            <TextInput
                              info={infos['discord']}
                              error={
                                errors['discord'] ||
                                (formState.errors.socials?.[idx]?.url && "Lien d'invitation requis")
                              }
                              loading={loading.includes('discord')}
                              label="Lien d'invitation"
                              {...register(`socials.${idx}.url`, {
                                validate: (value) =>
                                  value.length > 0 &&
                                  validate(
                                    {
                                      name: 'discord',
                                      fn: debouncedValidateDiscordInvite,
                                      callback: (data) => {
                                        update(idx, { ...field, url: value, pseudo: data?.guildName });
                                      },
                                    },
                                    { invite: value, format },
                                  ),
                              })}
                            />
                          ) : field.type === SocialType.Instagram ? (
                            <TextInput
                              error={
                                error && 'Votre handle ne peut contenir que des lettres, des chiffres et des points.'
                              }
                              startContent="instagram.com/"
                              label="Votre handle (sans @)"
                              {...register(`socials.${idx}.pseudo`, {
                                onChange: (event) => {
                                  update(idx, {
                                    ...field,
                                    pseudo: event.target.value,
                                    url: `https://instagram.com/${event.target.value}`,
                                  });
                                },
                                validate: (value) => /^[\w.]+$/.test(value),
                              })}
                            />
                          ) : field.type === SocialType.TikTok ? (
                            <TextInput
                              error={error && 'Handle invalide.'}
                              {...register(`socials.${idx}.pseudo`, {
                                onChange: (event) => {
                                  update(idx, {
                                    ...field,
                                    pseudo: event.target.value,
                                    url: `https://tiktok.com/@${event.target.value}`,
                                  });
                                },
                                validate: (value) => /^[\w.]+$/.test(value),
                              })}
                              startContent="tiktok.com/@"
                              label="Votre handle"
                            />
                          ) : field.type === SocialType.LinkedIn ? (
                            <TextInput
                              error={error && 'URL de groupe invalide.'}
                              {...register(`socials.${idx}.pseudo`, {
                                onChange: (event) => {
                                  update(idx, {
                                    ...field,
                                    pseudo: event.target.value,
                                    url: `https://linkedin.com/company/@${event.target.value}`,
                                  });
                                },
                                validate: (value) => /^[\w.-]+$/.test(value),
                              })}
                              startContent="linkedin.com/company/"
                              label="Votre groupe"
                            />
                          ) : field.type === SocialType.Facebook ? (
                            <TextInput
                              error={error && 'URL Facebook invalide.'}
                              {...register(`socials.${idx}.pseudo`, {
                                onChange: (event) => {
                                  update(idx, {
                                    ...field,
                                    pseudo: event.target.value,
                                    url: `https://facebook.com/${event.target.value}`,
                                  });
                                },
                                validate: (value) => /^[\d.A-Za-z]+$/.test(value),
                              })}
                              startContent="facebook.com/"
                              label="URL de votre page"
                            />
                          ) : field.type === SocialType.YouTube ? (
                            <TextInput
                              error={error && 'URL de chaîne invalide.'}
                              {...register(`socials.${idx}.pseudo`, {
                                onChange: (event) => {
                                  update(idx, {
                                    ...field,
                                    pseudo: event.target.value,
                                    url: `https://www.youtube.com/channel/${event.target.value}`,
                                  });
                                },
                                validate: (value) => /^.+$/.test(value),
                              })}
                              startContent="youtube.com/channel/"
                              label="ID de votre chaîne"
                            />
                          ) : field.type === SocialType.Twitch ? (
                            <TextInput
                              error={error && 'URL de chaîne invalide.'}
                              {...register(`socials.${idx}.pseudo`, {
                                onChange: (event) => {
                                  update(idx, {
                                    ...field,
                                    pseudo: event.target.value,
                                    url: `https://www.twitch.tv/${event.target.value}`,
                                  });
                                },
                                validate: (value) => /^\w+$/.test(value),
                              })}
                              startContent="twitch.tv/"
                              label="ID de votre chaîne"
                            />
                          ) : field.type === SocialType.GitHub ? (
                            <TextInput
                              error={error && 'URL GitHub invalide.'}
                              {...register(`socials.${idx}.pseudo`, {
                                onChange: (event) => {
                                  update(idx, {
                                    ...field,
                                    pseudo: event.target.value,
                                    url: `https://www.github.com/${event.target.value}`,
                                  });
                                },
                                validate: (value) => /^[\w.-]+$/.test(value),
                              })}
                              startContent="github.com/"
                              label="Nom de l'organisation"
                            />
                          ) : null}
                        </div>
                      </DragListItem>
                    )}
                  </Draggable>
                );
              })}
            </ul>
          )}
        </Droppable>
      </DragDropContext>
    </form>
  );
}
