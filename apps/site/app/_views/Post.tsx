'use client';

import MoreButton from './MoreButton';
import AvatarImage from '../_components/atoms/Image/AvatarImage';
import ILinkList from '../_components/atoms/Inline/ILinkList';
import CardButton from '../_components/molecules/Button/CardButton';

import { FavoriteType } from '../../schemas/Favorite/upsertFavoriteSchema';

import upsertReaction from '../../server/actions/Reaction/upsertReaction';
import upsertFavorite from '../../server/actions/Favorite/upsertFavorite';

import { getActorLink } from '../../utils/models/get-actor-link';
import { share } from '../../utils/share';

import { formatRelativeTime } from '../../utils/format/format-relative-time';
import { BookmarkSimple, Link as LinkIcon, ShareFat, ThumbsUp } from '@phosphor-icons/react';

import { ReactionType } from '@prisma/client';

import clsx from 'clsx';
import Link from 'next/link';
import { useFormatter, useLocale } from 'next-intl';

import { useState } from 'react';
import { toast } from 'sonner';

import type { ActorWithAvatar } from '../../types/prisma/Actor/actor-with-avatar';
import type { PostDetailsForUser } from '../../types/prisma/Post/post-details-for-user';
import type { PrismaData } from '../../utils/prisma-serialize';
import type { Locale } from '../../server/ssr/getLang';

export type PostProps = {
  actors?: { actor: ActorWithAvatar; slug: string }[];
  actorNote?: string;
  href?: string;
  children?: React.ReactNode;
  note?: React.ReactNode;
  upsertFavoriteData?: { id: string; type: FavoriteType };
  post: PrismaData<PostDetailsForUser>;
  name?: string;
};

const SHOW_ACTOR_COUNT = 2;
export default function Post({ actors, actorNote, href, children, note, upsertFavoriteData, post, name }: PostProps) {
  const postActors = actors ?? [post.createdBy];
  const [reaction, setReaction] = useState<ReactionType | null>(post.reactions[0]?.type);
  const [favorited, setFavorited] = useState(post.favorites.length > 0);

  const locale = useLocale() as Locale;
  const format = useFormatter();

  const link = href ?? `/post/${post.id}`;

  const extraActorsCount = postActors.length - SHOW_ACTOR_COUNT;
  const actorLabeled =
    postActors.length === 1 ? (
      <>
        <Link href={getActorLink(postActors[0].actor, postActors[0].slug)}>
          <AvatarImage actor={postActors[0].actor} />
        </Link>
        <div>
          <div>
            <Link
              href={getActorLink(postActors[0].actor, postActors[0].slug)}
              className="text-0 font-semibold hover:underline"
            >
              {postActors[0].actor.name}
            </Link>{' '}
            {actorNote}
          </div>
          <div className="text-2 text-sm">{formatRelativeTime(locale, new Date(post.createdAt))}</div>
        </div>
      </>
    ) : (
      <>
        <Link href={getActorLink(postActors[0].actor, postActors[0].slug)}>
          <AvatarImage actor={postActors[0].actor} />
        </Link>
        <div>
          <span>
            <ILinkList
              links={[
                ...postActors
                  .slice(0, SHOW_ACTOR_COUNT)
                  .map(({ actor, slug }) => ({ href: getActorLink(actor, slug), label: actor.name })),
                ...(extraActorsCount > 0
                  ? [
                      {
                        href: link,
                        label: `et ${extraActorsCount} autre${extraActorsCount > 1 ? 's' : ''}`,
                      },
                    ]
                  : []),
              ]}
              className="text-0 font-semibold"
            />
            {actorNote}
          </span>
          <div className="text-2 text-sm">{formatRelativeTime(locale, post.createdAt)}</div>
        </div>
      </>
    );

  return (
    <div className="pt-4 pb-0 px-0 gap-0 card-responsive bg-[var(--bg-main)] shadow-sm">
      {note && <div className="mb-3 text-2">{note}</div>}
      <div className="px-5">
        <div className={clsx('mb-4 flex items-center justify-between', note && 'border-t border-[var(--border-1)]')}>
          <div className="flex items-center gap-2">{actorLabeled}</div>
          <MoreButton
            actions={[
              {
                icon: <LinkIcon className="w-6 h-6" />,
                children: 'Copier le lien',
                action: () => {
                  navigator.clipboard.writeText(href ?? `/post/${post.id}`);
                  toast.info('Lien copié dans le presse-papier');
                },
              },
            ]}
          />
        </div>
        <div className="whitespace-pre-wrap text-0">{post.content}</div>
      </div>
      {children && <div className="mt-4">{children}</div>}
      <div className="grid grid-cols-3 py-1.5 px-2">
        <CardButton
          action={{
            serverAction: async (formData) => {
              return upsertReaction(formData).then((formState) => {
                if (formState?.data !== undefined) setReaction(formState.data);
                return formState;
              });
            },
            data: reaction ? { postId: post.id.toString() } : { postId: post.id.toString(), type: ReactionType.Like },
          }}
          active={!!reaction}
          activeColor="var(--info)"
          icons={{ base: <ThumbsUp className="w-6 h-6" />, selected: <ThumbsUp weight="fill" className="w-6 h-6" /> }}
          label="J'aime"
        />
        <CardButton
          action={{
            serverAction: async (formData) => {
              const current = favorited;
              setFavorited(!current);
              return upsertFavorite(formData).then((formState) => {
                if (formState.errors) setFavorited(current);
                else if (formState?.data) setFavorited(!current);
                return formState;
              });
            },
            data: upsertFavoriteData ?? { id: post.id.toString(), type: FavoriteType.Post },
          }}
          active={!!favorited}
          icons={{
            base: <BookmarkSimple className="w-6 h-6" />,
            selected: <BookmarkSimple weight="fill" className="w-6 h-6" />,
          }}
          label="Enregister"
        />
        <CardButton
          action={() => share(link, name ?? post.content, post.content)}
          icons={{ base: <ShareFat className="w-6 h-6" />, selected: <ShareFat weight="fill" className="w-6 h-6" /> }}
          label="Partager"
        />
      </div>
    </div>
  );
}
