import SocialIcon from '../../_components/atoms/Icon/SocialIcon';
import TextInput from '../../_components/molecules/Input/Uncontrolled/String/TextInput';
import DragListItem from '../../_components/molecules/List/DragListItem';

// import { validateDiscordInvite } from '../../../utils/form-validation/discord-invite';
// import { useAsyncValidation } from '../../_hooks/useAsyncValidation';
import { moveImmutable, setAtIndexImmutable } from '@okampus/shared/utils';

import { SocialType } from '@prisma/client';
import { useFormatter } from 'next-intl';
import { DragDropContext, Droppable, Draggable } from 'react-beautiful-dnd';

import type { SocialMinimal } from '../../../types/prisma/Social/social-minimal';
import type { OnDragEndResponder } from 'react-beautiful-dnd';
import type { useForm } from 'react-hook-form';

export type SocialsFormProps = {
  formMethods: ReturnType<typeof useForm<{ socials: SocialMinimal[] }>>;
  className?: string;
};

// const debouncedValidateDiscordInvite = debounce(validateDiscordInvite, 200);

export default function SocialsForm({ formMethods, className }: SocialsFormProps) {
  const format = useFormatter();

  const { register, trigger, formState, watch, setValue, setError, clearErrors } = formMethods;
  const socials = watch('socials') ?? [];

  const update = (index: number, value: SocialMinimal) => {
    setValue('socials', setAtIndexImmutable(socials, index, value), { shouldDirty: true });
  };

  // const { validate, loading, info, resetValidation } = useAsyncValidation({
  //   fn: debouncedValidateDiscordInvite,
  //   callback: (data) => {
  //     const index = socials.findIndex((social) => social.type === SocialType.Discord);
  //     if (!index) return;

  //     update(index, { ...socials[index], pseudo: data.guildName ?? '' });
  //   },
  //   callbackError: (error) => {
  //     const index = socials.findIndex((social) => social.type === SocialType.Discord);
  //     if (!index) return;

  //     error ? setError('socials', { message: error }) : clearErrors(`socials.${index}.url`);
  //   },
  // });

  const addableSocials = Object.values(SocialType).filter((value) => !socials.some((social) => social.type === value));

  const handleDrag: OnDragEndResponder = ({ source: { index: from }, destination }) => {
    if (destination) {
      const change = moveImmutable(socials, from, destination.index).map((value, idx) => ({ ...value, order: idx }));
      setValue('socials', change, { shouldDirty: true });
      setTimeout(trigger, 100);
    }
  };

  // TODO refactor with next links example
  {
    /*         < className="bg-2 p-4 md:rounded-2xl mb-6" heading="Ajouter des réseaux à votre profil"> */
  }
  return (
    <div className={className}>
      {addableSocials.length > 0 && (
        <>
          <div className="text-xs">Cliquez sur un réseau pour ajouter un lien qui apparaîtra sur votre profil.</div>
          <span className="flex gap-4 items-center flex-wrap">
            {addableSocials.map((value) => (
              <SocialIcon
                className="shrink-0 bg-3"
                key={value}
                social={value}
                // onClick={() => {
                //   // setValue(
                //   //   'socials',
                //   //   [
                //   //     { type: value, url: '', pseudo: '', order: 0 },
                //   //     ...socials.map((social) => ({ ...social, order: social.order + 1 })),
                //   //   ],
                //   //   { shouldDirty: true },
                //   // );
                //   setTimeout(trigger, 100);
                // }}
              />
            ))}
          </span>
        </>
      )}
      <DragDropContext onDragEnd={handleDrag}>
        <Droppable droppableId="socials">
          {(provided) => (
            <ul {...provided.droppableProps} ref={provided.innerRef}>
              {socials.map((field, idx) => {
                const error = formState.errors.socials?.[idx]?.pseudo;
                return (
                  <Draggable key={`social-${idx}`} draggableId={`social-${idx}`} index={idx}>
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
                          // if (field.type === SocialType.Discord) resetValidation();
                          setTimeout(trigger, 100);
                        }}
                      >
                        <div className="flex gap-4">
                          <SocialIcon social={field.type} />
                          <div className="!text-lg text-base font-medium text-[var(--text-0)] mt-2">
                            {field.type} {field.pseudo ? `• ${field.pseudo}` : ''}
                          </div>
                        </div>
                        <div className="px-1 md:pl-16">
                          {field.type === SocialType.Discord ? null : field.type === SocialType.Instagram ? ( // /> //   // })} //   //   validate: (value) => value.length > 0 && validate({ invite: value, format }), //   // {...register(`socials.${idx}.url`, { //   label="Lien d'invitation" //   loading={loading} //   error={formState.errors.socials?.[idx]?.url?.message} //   info={info} //   name={`socials.${idx}.url`} // <TextInput
                            <TextInput
                              name={`socials.${idx}.pseudo`}
                              error={
                                error && 'Votre handle ne peut contenir que des lettres, des chiffres et des points.'
                              }
                              start="instagram.com/"
                              label="Votre handle (sans @)"
                              // {...register(`socials.${idx}.pseudo`, {
                              //   onChange: (event) => {
                              //     update(idx, {
                              //       ...field,
                              //       pseudo: event.target.value,
                              //       url: `https://instagram.com/${event.target.value}`,
                              //     });
                              //   },
                              //   validate: (value) => /^[\w.]+$/.test(value),
                              // })}
                            />
                          ) : field.type === SocialType.TikTok ? (
                            <TextInput
                              error={error && 'Handle invalide.'}
                              name={`socials.${idx}.pseudo`}
                              // {...register(`socials.${idx}.pseudo`, {
                              //   onChange: (event) => {
                              //     update(idx, {
                              //       ...field,
                              //       pseudo: event.target.value,
                              //       url: `https://tiktok.com/@${event.target.value}`,
                              //     });
                              //   },
                              //   validate: (value) => /^[\w.]+$/.test(value),
                              // })}
                              start="tiktok.com/@"
                              label="Votre handle"
                            />
                          ) : field.type === SocialType.LinkedIn ? (
                            <TextInput
                              error={error && 'URL de groupe invalide.'}
                              name={`socials.${idx}.pseudo`}
                              // {...register(`socials.${idx}.pseudo`, {
                              //   onChange: (event) => {
                              //     update(idx, {
                              //       ...field,
                              //       pseudo: event.target.value,
                              //       url: `https://linkedin.com/company/@${event.target.value}`,
                              //     });
                              //   },
                              //   validate: (value) => /^[\w.-]+$/.test(value),
                              // })}
                              start="linkedin.com/company/"
                              label="Votre groupe"
                            />
                          ) : field.type === SocialType.Facebook ? (
                            <TextInput
                              error={error && 'URL Facebook invalide.'}
                              name={`socials.${idx}.pseudo`}
                              // {...register(`socials.${idx}.pseudo`, {
                              //   onChange: (event) => {
                              //     update(idx, {
                              //       ...field,
                              //       pseudo: event.target.value,
                              //       url: `https://facebook.com/${event.target.value}`,
                              //     });
                              //   },
                              //   validate: (value) => /^[\d.A-Za-z]+$/.test(value),
                              // })}
                              start="facebook.com/"
                              label="URL de votre page"
                            />
                          ) : field.type === SocialType.YouTube ? (
                            <TextInput
                              error={error && 'URL de chaîne invalide.'}
                              name={`socials.${idx}.pseudo`}
                              // {...register(`socials.${idx}.pseudo`, {
                              //   onChange: (event) => {
                              //     update(idx, {
                              //       ...field,
                              //       pseudo: event.target.value,
                              //       url: `https://www.youtube.com/channel/${event.target.value}`,
                              //     });
                              //   },
                              //   validate: (value) => /^.+$/.test(value),
                              // })}
                              start="youtube.com/channel/"
                              label="ID de votre chaîne"
                            />
                          ) : field.type === SocialType.WhatsApp ? (
                            <TextInput
                              error={error && 'URL de groupe.'}
                              name={`socials.${idx}.pseudo`}
                              // {...register(`socials.${idx}.pseudo`, {
                              //   onChange: (event) => {
                              //     update(idx, { ...field, pseudo: event.target.value, url: event.target.value });
                              //   },
                              //   validate: (value) => /^\w+$/.test(value),
                              // })}
                              label="URL de groupe WhatsApp"
                            />
                          ) : field.type === SocialType.GitHub ? (
                            <TextInput
                              error={error && 'URL GitHub invalide.'}
                              name={`socials.${idx}.pseudo`}
                              // {...register(`socials.${idx}.pseudo`, {
                              //   onChange: (event) => {
                              //     update(idx, {
                              //       ...field,
                              //       pseudo: event.target.value,
                              //       url: `https://www.github.com/${event.target.value}`,
                              //     });
                              //   },
                              //   validate: (value) => /^[\w.-]+$/.test(value),
                              // })}
                              start="github.com/"
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
    </div>
  );
}
