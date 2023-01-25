import { TeamCard } from '@okampus/ui/molecules';

const clubs = [
  {
    id: 1,
    name: 'Wiegand, Grant and Lynch',
    description:
      'ut ultrices vel augue vestibulum ante ipsum primis in faucibus orci luctus et ultrices posuere cubilia curae donec',
    tag_1: 'global',
    tag_1_color: '#8fe781',
    tag_2: null,
    tag_2_color: '#4afa06',
  },
  {
    id: 2,
    name: 'Terry, Zboncak and Sporer',
    description:
      'semper est quam pharetra magna ac consequat metus sapien ut nunc vestibulum ante ipsum primis in faucibus orci',
    tag_1: 'model',
    tag_1_color: '#9cdcca',
    tag_2: 'hybrid',
    tag_2_color: '#595fa9',
  },
  {
    id: 3,
    name: 'Barton Group',
    description: 'in libero ut massa volutpat convallis morbi odio odio elementum',
    tag_1: 'orchestration',
    tag_1_color: '#818cf5',
    tag_2: 'uniform',
    tag_2_color: '#dd9e10',
  },
  {
    id: 4,
    name: 'Labadie-Huels',
    description: 'vestibulum ante ipsum primis in faucibus orci luctus et ultrices posuere cubilia',
    tag_1: 'utilisation',
    tag_1_color: '#6a5ebd',
    tag_2: null,
    tag_2_color: '#01ceac',
  },
  {
    id: 5,
    name: 'Hudson LLC',
    description: 'non mauris morbi non lectus aliquam sit amet diam in magna',
    tag_1: 'Team-oriented',
    tag_1_color: '#6a5ebd',
    tag_2: 'Total',
    tag_2_color: '#31dca2',
  },
  {
    id: 6,
    name: 'Wolff, Gerhold and Goldner',
    description: 'consectetuer eget rutrum at lorem integer tincidunt ante vel ipsum praesent blandit',
    tag_1: 'cohesive',
    tag_1_color: '#519bfb',
    tag_2: null,
    tag_2_color: '#d9d29f',
  },
  {
    id: 28,
    name: 'Harris, Purdy and Toy',
    description: 'vulputate elementum nullam varius nulla facilisi cras non velit nec nisi vulputate nonummy maecenas',
    tag_1: 'firmware',
    tag_1_color: '#cd3782',
    tag_2: null,
    tag_2_color: '#af078e',
  },
  {
    id: 29,
    name: 'Waelchi, Zulauf and Crooks',
    description: 'id lobortis convallis tortor risus dapibus augue vel accumsan tellus nisi eu orci mauris lacinia',
    tag_1: 'Automated',
    tag_1_color: '#49fe0c',
    tag_2: 'capability',
    tag_2_color: '#98c2d8',
  },
  {
    id: 30,
    name: 'Turcotte-Stiedemann',
    description: 'nec euismod scelerisque quam turpis adipiscing lorem vitae mattis nibh ligula',
    tag_1: 'multi-state',
    tag_1_color: '#0531fc',
    tag_2: 'optimal',
    tag_2_color: '#b8f38e',
  },
  {
    id: 31,
    name: 'Blanda-Pacocha',
    description:
      'mauris laoreet ut rhoncus aliquet pulvinar sed nisl nunc rhoncus dui vel sem sed sagittis nam congue risus',
    tag_1: 'task-force',
    tag_1_color: '#905e00',
  },
  {
    id: 32,
    name: 'Marquardt, Kihn and Harber',
    description: 'vulputate ut ultrices vel augue vestibulum ante ipsum primis in faucibus orci luctus',
    tag_1: 'exuding',
    tag_1_color: '#af7e2b',
    tag_2: '3rd generation',
    tag_2_color: '#fdddcf',
  },
  {
    id: 33,
    name: 'Beier Group',
    description: 'vel augue vestibulum rutrum rutrum neque aenean auctor gravida sem praesent id',
    tag_1: 'Ergonomic',
    tag_1_color: '#510a34',
    tag_2: null,
    tag_2_color: '#0139f6',
  },
  {
    id: 34,
    name: 'Walsh-Effertz',
    description: 'cubilia curae nulla dapibus dolor vel est donec odio justo sollicitudin ut',
    tag_1: 'local',
    tag_1_color: '#fe2029',
    tag_2: 'bifurcated',
    tag_2_color: '#e8a7a4',
  },
  {
    id: 35,
    name: 'Haley-Bernhard',
    description: 'luctus ultricies eu nibh quisque id justo sit amet sapien',
    tag_1: 'homogeneous',
    tag_1_color: '#56a78f',
    tag_2: 'global',
    tag_2_color: '#354e7e',
  },
  {
    id: 36,
    name: 'Johns Inc',
    description:
      'purus aliquet at feugiat non pretium quis lectus suspendisse potenti in eleifend quam a odio in hac habitasse platea',
    tag_1: 'Virtual',
    tag_1_color: '#02d648',
    tag_2: null,
    tag_2_color: '#588c53',
  },
  {
    id: 37,
    name: 'Lind Group',
    description: 'orci mauris lacinia sapien quis libero nullam sit amet turpis',
    tag_1: 'actuating',
    tag_1_color: '#385860',
    tag_2: 'mobile',
    tag_2_color: '#e1bcf8',
  },
  {
    id: 38,
    name: 'McDermott-DuBuque',
    description: 'massa id nisl venenatis lacinia aenean sit amet justo morbi ut odio cras',
    tag_1: 'conglomeration',
    tag_1_color: '#972751',
    tag_2: null,
    tag_2_color: '#3ead08',
  },
  {
    id: 39,
    name: 'Little Inc',
    description: 'sed justo pellentesque viverra pede ac diam cras pellentesque volutpat dui maecenas tristique',
    tag_1: 'toolset',
    tag_1_color: '#2d51c0',
    tag_2: 'Synergistic',
    tag_2_color: '#f7b843',
  },
  {
    id: 40,
    name: 'Runolfsdottir LLC',
    description:
      'tempus semper est quam pharetra magna ac consequat metus sapien ut nunc vestibulum ante ipsum primis in',
    tag_1: 'multimedia',
    tag_1_color: '#7d934f',
    tag_2: 'Object-based',
    tag_2_color: '#a08ee8',
  },
  {
    id: 8,
    name: 'Bauch Inc',
    description:
      'id mauris vulputate elementum nullam varius nulla facilisi cras non velit nec nisi vulputate nonummy maecenas tincidunt lacus at velit',
    tag_1: 'grid-enabled',
    tag_1_color: '#275273',
    tag_2: null,
    tag_2_color: '#36eace',
  },
  {
    id: 9,
    name: 'Runte-Gerhold',
    description: 'nisl aenean lectus pellentesque eget nunc donec quis orci eget',
    tag_1: 'next generation',
    tag_1_color: '#849318',
    tag_2: 'neural-net',
    tag_2_color: '#813e06',
  },
  {
    id: 10,
    name: 'Harvey Group',
    description: 'magna bibendum imperdiet nullam orci pede venenatis non sodales sed tincidunt',
    tag_1: 'reciprocal',
    tag_1_color: '#7d716a',
    tag_2: 'neutral',
    tag_2_color: '#c49953',
  },
  {
    id: 11,
    name: 'Haley, Murphy and Mueller',
    description:
      'suspendisse ornare consequat lectus in est risus auctor sed tristique in tempus sit amet sem fusce consequat',
    tag_1: 'Triple-buffered',
    tag_1_color: '#955f3e',
    tag_2: 'Horizontal',
    tag_2_color: '#97d152',
  },
  {
    id: 12,
    name: 'Homenick-Skiles',
    description:
      'viverra dapibus nulla suscipit ligula in lacus curabitur at ipsum ac tellus semper interdum mauris ullamcorper purus sit',
    tag_1: 'leading edge',
    tag_1_color: '#84b9ac',
    tag_2: null,
    tag_2_color: '#4f9c27',
  },
  {
    id: 13,
    name: 'Champlin-Kihn',
    description:
      'sagittis nam congue risus semper porta volutpat quam pede lobortis ligula sit amet eleifend pede libero quis',
    tag_1: 'hub',
    tag_1_color: '#697612',
    tag_2: 'fault-tolerant',
    tag_2_color: '#af11c7',
  },
  {
    id: 14,
    name: "O'Kon Group",
    description: 'imperdiet sapien urna pretium nisl ut volutpat sapien arcu sed augue aliquam erat volutpat in',
    tag_1: 'Business-focused',
    tag_1_color: '#7ae882',
    tag_2: 'website',
    tag_2_color: '#18176e',
  },
  {
    id: 15,
    name: 'Beatty Group',
    description:
      'tristique est et tempus semper est quam pharetra magna ac consequat metus sapien ut nunc vestibulum ante ipsum',
    tag_1: 'fault-tolerant',
    tag_1_color: '#33df1b',
    tag_2: 'open architecture',
    tag_2_color: '#6fe5c9',
  },
  {
    id: 16,
    name: 'Ebert, Beer and Dicki',
    description:
      'ut massa volutpat convallis morbi odio odio elementum eu interdum eu tincidunt in leo maecenas pulvinar lobortis est',
    tag_1: 'concept',
    tag_1_color: '#8eb9a1',
    tag_2: 'responsive',
    tag_2_color: '#b7490e',
  },
  {
    id: 17,
    name: 'Rau, Ritchie and Cummings',
    description:
      'posuere cubilia curae donec pharetra magna vestibulum aliquet ultrices erat tortor sollicitudin mi sit amet lobortis sapien sapien non mi',
    tag_1: 'analyzer',
    tag_1_color: '#6b5945',
    tag_2: 'Cloned',
    tag_2_color: '#6ad70b',
  },
  {
    id: 18,
    name: 'Kuhic and Sons',
    description:
      'morbi a ipsum integer a nibh in quis justo maecenas rhoncus aliquam lacus morbi quis tortor id nulla ultrices aliquet',
    tag_1: 'high-level',
    tag_1_color: '#d6bb83',
    tag_2: 'analyzing',
    tag_2_color: '#80cec9',
  },
  {
    id: 19,
    name: 'Koss, Bosco and Hane',
    description: 'ligula sit amet eleifend pede libero quis orci nullam molestie nibh in lectus pellentesque at',
    tag_1: 'Intuitive',
    tag_1_color: '#2accb9',
    tag_2: 'web-enabled',
    tag_2_color: '#bb2cdc',
  },
  {
    id: 20,
    name: 'Bins, Nienow and Schuster',
    description:
      'posuere cubilia curae donec pharetra magna vestibulum aliquet ultrices erat tortor sollicitudin mi sit amet lobortis sapien sapien',
    tag_1: 'scalable',
    tag_1_color: '#d63117',
    tag_2: 'algorithm',
    tag_2_color: '#a080fa',
  },
  {
    id: 21,
    name: 'Erdman-Collier',
    description:
      'nunc commodo placerat praesent blandit nam nulla integer pede justo lacinia eget tincidunt eget tempus vel pede',
    tag_1: 'multimedia',
    tag_1_color: '#82d76e',
    tag_2: 'national',
    tag_2_color: '#a66888',
  },
  {
    id: 22,
    name: 'Carroll-Greenholt',
    description: 'urna ut tellus nulla ut erat id mauris vulputate elementum nullam varius nulla',
    tag_1: 'Expanded',
    tag_1_color: '#ca177b',
    tag_2: 'web-enabled',
    tag_2_color: '#4edc91',
  },
  {
    id: 23,
    name: 'Gutkowski-Rath',
    description: 'luctus rutrum nulla tellus in sagittis dui vel nisl duis ac nibh fusce lacus purus',
    tag_1: 'Vision-oriented',
    tag_1_color: '#bf9a1b',
    tag_2: null,
    tag_2_color: '#4bf53e',
  },
  {
    id: 24,
    name: 'Gusikowski, Metz and Goyette',
    description:
      'id massa id nisl venenatis lacinia aenean sit amet justo morbi ut odio cras mi pede malesuada in imperdiet',
    tag_1: 'challenge',
    tag_1_color: '#bf9efc',
    tag_2: 'Progressive',
    tag_2_color: '#95bb30',
  },
  {
    id: 25,
    name: 'Walsh-Collier',
    description:
      'integer a nibh in quis justo maecenas rhoncus aliquam lacus morbi quis tortor id nulla ultrices aliquet maecenas leo',
    tag_1: 'Ergonomic',
    tag_1_color: '#6b6dbb',
    tag_2: null,
    tag_2_color: '#81c08b',
  },
  {
    id: 26,
    name: 'Bechtelar, McLaughlin and Kovacek',
    description:
      'posuere cubilia curae nulla dapibus dolor vel est donec odio justo sollicitudin ut suscipit a feugiat et eros vestibulum ac',
    tag_1: 'time-frame',
    tag_1_color: '#1fb610',
    tag_2: 'client-server',
    tag_2_color: '#3c1e9a',
  },
  {
    id: 27,
    name: 'Cronin-Dietrich',
    description: 'amet justo morbi ut odio cras mi pede malesuada in imperdiet et commodo vulputate justo in',
    tag_1: 'dynamic',
    tag_1_color: '#280c8c',
    tag_2: 'process improvement',
    tag_2_color: '#70aa58',
  },
];

export function TeamList() {
  return (
    <div className="grid grid-cols-3 lg:grid-cols-4 gap-4">
      {clubs.map((club) => (
        <TeamCard
          key={club.id}
          name={club.name}
          description={club.description}
          tags={[
            { name: club.tag_1, color: club.tag_1_color },
            ...(club.tag_2 ? [{ name: club.tag_2, color: club.tag_2_color }] : []),
          ]}
        />
      ))}
    </div>
  );
}
