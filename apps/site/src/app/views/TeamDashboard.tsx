import type { ITeam, IUser } from '@okampus/shared/dtos';
import { ActorImageType } from '@okampus/shared/enums';
import { ReactComponent as DocIcon } from '@okampus/assets/svg/big-icons/doc.svg';
import { Avatar } from '@okampus/ui/atoms';
import { Dashboard } from '@okampus/ui/organisms';

const columns = [
  {
    label: 'Association',
    sortable: true,
    render: (value: ITeam) => (
      <div className="flex gap-2 items-center">
        <Avatar
          src={value.actor.actorImages?.find((actorImage) => actorImage.type === ActorImageType.Avatar)?.image?.url}
          name={value.actor.name}
        />
        <div>{value.actor.name}</div>
      </div>
    ),
  },
  {
    label: 'Président',
    sortable: true,
    render: (value: ITeam) => {
      const president = value?.members?.find((member) => (member.role as unknown as string) === 'president')
        ?.user as IUser;

      return (
        <div className="flex gap-2 items-center">
          <Avatar
            src={
              president.actor?.actorImages?.find((actorImage) => actorImage.type === ActorImageType.Avatar)?.image?.url
            }
            name={president.actor.name}
          />
          <div>{president.actor.name}</div>
        </div>
      );
    },
  },
  {
    label: 'Trésorier',
    sortable: true,
    render: (value: ITeam) => {
      const treasurer = value?.members?.find((member) => (member.role as unknown as string) === 'treasurer')
        ?.user as IUser;

      return (
        <div className="flex gap-2 items-center">
          <Avatar
            src={
              treasurer.actor?.actorImages?.find((actorImage) => actorImage.type === ActorImageType.Avatar)?.image?.url
            }
            name={treasurer.actor.name}
          />
          <div>{treasurer.actor.name}</div>
        </div>
      );
    },
  },
  {
    label: 'Statuts',
    sortable: true,
    center: true,
    render: () => (
      <div className="flex justify-center">
        <DocIcon height={32} />
      </div>
    ),
  },
];

const data = [
  {
    actor: {
      name: 'Horizon',
      actorImages: [
        {
          type: ActorImageType.Avatar,
          image: {
            url: 'https://cdn.discordapp.com/icons/827518251608178728/3f066f2e311cac3391786c1b1872adc7.webp?size=96',
          },
        },
      ],
    },
    members: [
      {
        role: 'president',
        user: {
          actor: {
            name: 'Léo Liu',
            actorImages: [
              {
                type: ActorImageType.Avatar,
                image: {
                  url: 'https://images.pexels.com/photos/2379005/pexels-photo-2379005.jpeg?auto=compress&cs=tinysrgb&dpr=1&w=500',
                },
              },
            ],
          },
        },
      },
      {
        role: 'treasurer',
        user: {
          actor: {
            name: 'Josselin Chauvin',
          },
        },
      },
    ],
  },
  {
    actor: {
      name: 'Efrei Picture Studio',
    },
    members: [
      {
        role: 'president',
        user: {
          actor: {
            name: 'Mathis Kouam',
          },
        },
      },
      {
        role: 'treasurer',
        user: {
          actor: {
            name: 'Pia Stücker',
          },
        },
      },
    ],
  },
  {
    actor: {
      name: 'Efrei Poker',
    },
    members: [
      {
        role: 'president',
        user: {
          actor: {
            name: 'Camille Lefebvre',
          },
        },
      },
      {
        role: 'treasurer',
        user: {
          actor: {
            name: 'Omar El Khatib',
          },
        },
      },
    ],
  },
  {
    actor: {
      name: 'ICE Efrei',
    },
    members: [
      {
        role: 'president',
        user: {
          actor: {
            name: 'Paul Simon',
          },
        },
      },
      {
        role: 'treasurer',
        user: {
          actor: {
            name: 'Léa Martin',
          },
        },
      },
    ],
  },
] as unknown as ITeam[];

console.log(columns);

export const TeamDashboard = () => {
  return (
    // <div className="w-full overflow-hidden">
    <Dashboard columns={columns} data={data} />
    // </div>
  );
};
