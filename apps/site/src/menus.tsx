// import { ReactComponent as EventIcon } from '@okampus/assets/svg/icons/event.svg';
// import * as React from 'react';
// eslint-disable-next-line unused-imports/no-unused-imports
// import React from 'react';
// import { ReactComponent as NewsIcon } from '@okampus/assets/svg/icons/news.svg';
// import { ReactComponent as HomeIcon } from '@okampus/assets/svg/icons/home.svg';
import { ReactComponent as CalendarIcon } from '@okampus/assets/svg/icons/calendar.svg';
import { ReactComponent as PeopleIcon } from '@okampus/assets/svg/icons/people.svg';
import { ReactComponent as SiteMapIcon } from '@okampus/assets/svg/icons/sitemap.svg';
import { ReactComponent as TeamsIcon } from '@okampus/assets/svg/icons/team.svg';
import { ReactComponent as GaugeIcon } from '@okampus/assets/svg/icons/gauge.svg';
import { ReactComponent as SettingsIcon } from '@okampus/assets/svg/icons/settings.svg';
import { ReactComponent as CalendarUpcomingIcon } from '@okampus/assets/svg/icons/calendar-upcoming.svg';
import { ReactComponent as TablesIcon } from '@okampus/assets/svg/icons/tables.svg';
import { ReactComponent as WalletIcon } from '@okampus/assets/svg/icons/wallet.svg';

export default {
  // me: {
  //   hasId: false,
  //   manageView: null,
  //   menus: {
  //     profile: {
  //       label: 'Profil',
  //       tip: 'Gestion de votre compte',
  //       // icon: 'fa fa-cog',
  //       sub: {
  //         profile: {
  //           label: 'Profil',
  //           tip: 'Informations personnelles',
  //           // icon: 'fa fa-user',
  //         },
  //         security: {
  //           label: 'Sécurité',
  //           tip: 'Mot de passe & sécurité',
  //           // icon: 'fa fa-shield',
  //         },
  //       },
  //     },
  //     preferences: {
  //       label: 'Préférences',
  //       tip: 'Personnalisation de votre expérience',
  //       // icon: 'fa fa-paintbrush',
  //       sub: {
  //         theme: {
  //           label: 'Apparence',
  //           tip: "Apparence graphique de l'interface",
  //           // icon: 'fa fa-paintbrush',
  //         },
  //         alerts: {
  //           label: 'Notifications',
  //           tip: 'Notifications & alertes',
  //           // icon: 'fa fa-bell',
  //         },
  //       },
  //     },
  //     data: {
  //       label: 'RGPD',
  //       tip: 'Gestion de vos données personnelles',
  //       // icon: 'fa fa-database',
  //       sub: {
  //         export: {
  //           label: 'Vos données',
  //           tip: 'Visualisation & export de vos données',
  //           // icon: 'fa fa-vault',
  //         },
  //         settings: {
  //           label: 'Paramètres',
  //           tip: 'Paramètres de vos données personnelles',
  //           // icon: 'fa fa-trash',
  //         },
  //       },
  //     },
  //   },
  // },
  home: {
    hasId: false,
    manageView: 'admin',
    menus: {
      // home: {
      //   label: 'Accueil',
      //   tip: 'Actualités & annonces',
      //   icon: HomeIcon, //HomeIcon
      //   link: '/',
      //   // icon: 'fa fa-square-rss',
      // },
      // news: {
      //   label: 'Annonces',
      //   tip: 'Actualités & annonces',
      //   icon: NewsIcon, //HomeIcon
      //   // icon: 'fa fa-square-rss',
      // },
      // explore: {
      //   label: 'Explore',
      //   tip: 'Découvre ton école ⭐',
      //   // icon: 'fa fa-compass',
      //   sub: {
      //     clubs: {
      //       label: 'Associations',
      //       tip: 'Toutes les associations',
      //       icon: 'fa fa-arrow-right-arrow-left',
      //     },
      //     swipe: {
      //       label: 'Swiper',
      //       tip: 'Trouve les associations qui te correspondent !',
      //       icon: 'fa fa-arrow-right-arrow-left',
      //     },
      //     people: {
      //       label: 'Annuaire',
      //       tip: 'Contacts et profils',
      //       icon: 'fa fa-circle-nodes',
      //     },
      //     staff: {
      //       label: 'Staff',
      //       tip: "Découvre le staff de l'école",
      //       icon: 'fa fa-sitemap',
      //     },
      //   },
      // },
      clubs: {
        label: 'Associations',
        tip: 'Toutes les associations',
        icon: TeamsIcon,
        link: '/clubs',
        // icon: 'fa fa-arrow-right-arrow-left',
      },
      events: {
        label: 'Événements',
        tip: 'Événements, sorties et activités',
        icon: CalendarIcon,
        link: '/events',
        // icon: 'fa fa-calendar',
        // sub: {
        //   calendar: {
        //     label: 'Calendrier',
        //     tip: 'Calendrier',
        //     icon: 'fa fa-calendar',
        //   },
        //   map: {
        //     label: 'Carte',
        //     tip: 'Trouve les sorties proches de chez toi',
        //     icon: 'fa fa-location-dot',
        //   },
        // },
      },
      people: {
        label: 'Annuaire',
        tip: 'Contacts et profils',
        icon: PeopleIcon,
        link: '/people',
        // icon: 'fa fa-circle-nodes',
      },
      staff: {
        label: 'Staff',
        tip: "Découvre le staff de l'école",
        icon: SiteMapIcon,
        link: '/staff',
      },
      // share: {
      //   label: 'Share',
      //   tip: 'Partage tes photos et vidéos',
      //   icon: 'fa fa-camera',
      //   sub: {
      //     photos: {
      //       label: 'Photos',
      //       tip: 'Partage tes photos',
      //       icon: 'fa fa-camera',
      //     },
      //     videos: {
      //       label: 'Vidéos',
      //       tip: 'Partage tes vidéos',
      //       icon: 'fa fa-film',
      //     },
      //   },
      // },
    },
  },
  admin: {
    hasId: false,
    manageView: null,
    menus: {
      clubs: {
        label: 'Dashboards',
        tip: 'Dashboards des associations',
        link: '/admin/clubs',
        icon: TablesIcon,
        // icon: 'fa fa-gauge',
      },
      events: {
        label: 'Événements',
        tip: 'Gestion des événements',
        link: '/admin/events',
        icon: CalendarIcon,
        // icon: 'fa fa-calendar',
      },
      dash: {
        label: 'Tableau de bord',
        tip: 'KPIs et alertes',
        link: '/admin',
        icon: GaugeIcon,
        // icon: 'fa fa-gauge',
      },
      portal: {
        label: 'Portail',
        tip: 'Paramètres du portail',
        // icon: 'fa fa-gear',
        icon: SettingsIcon,
        link: '/admin/settings',
        sub: {
          settings: {
            label: 'Apparence',
            tip: 'Personnalisation graphique du portail',
            link: '/admin/settings',

            // icon: 'fa fa-paintbrush',
          },
          staff: {
            label: 'Rôles',
            tip: 'Accès et permissions',
            link: '/admin/roles',
            // icon: 'fa fa-fingerprint',
          },
          teams: {
            label: 'Équipes',
            tip: 'Gestion des équipes du staff',
            link: '/admin/staff',
            // icon: SiteMapIcon,
            // icon: 'fa fa-sitemap',
          },
          process: {
            label: 'Processus',
            tip: 'Étapes de validations & processus',
            link: '/admin/validations',
            // icon: 'fa fa-arrows-spin',
          },
        },
      },
    },
  },
  // club: {
  //   hasId: true,
  //   redirectNoId: '/home/explore/clubs',
  //   manageView: 'manage',
  //   link: '/club/:id',
  //   // menus: {
  //   //   dash: {
  //   //     label: 'Général',
  //   //     tip: "Présentation de l'association",
  //   //     link: '/club/:id',
  //   //     // icon: 'fa fa-compass',
  //   //   },
  //   // },
  // },
  manage: {
    hasId: true,
    redirectNoId: '/home/explore/clubs',
    manageView: null,
    menus: {
      // dash: {
      //   label: 'Tableau de bord',
      //   tip: "KPIs de l'association",
      //   link: '/:orgId/manage',
      //   icon: GaugeIcon,
      //   // icon: 'fa fa-gauge',
      // },
      // members: {
      //   label: 'Membres',
      //   tip: 'Gestion des membres et invitations',
      //   // icon: 'fa fa-users',
      //   icon: TeamsIcon,
      //   link: '/:orgId/manage/org',
      //   sub: {
      //     org: {
      //       label: 'Équipe',
      //       tip: "Organigramme de l'association",
      //       link: '/:orgId/manage/org',
      //       icon: SiteMapIcon,
      //       // icon: 'fa fa-sitemap',
      //     },
      //     invites: {
      //       label: 'Adhésions',
      //       tip: "Invitations/demandes d'adhésion en attente",
      //       link: '/:orgId/manage/invite',
      //       // icon: 'fa fa-paper-plane',
      //     },
      //   },
      // },
      treasury: {
        label: 'Trésorerie',
        tip: 'Gestion des membres et invitations',
        // icon: 'fa fa-users',
        icon: WalletIcon,
        link: '/:orgId/manage/treasury',
        // sub: {
        //   org: {
        //     label: 'Équipe',
        //     tip: "Organigramme de l'association",
        //     link: '/:orgId/manage/org',
        //     icon: SiteMapIcon,
        //     // icon: 'fa fa-sitemap',
        //   },
        //   invites: {
        //     label: 'Adhésions',
        //     tip: "Invitations/demandes d'adhésion en attente",
        //     link: '/:orgId/manage/invite',
        //     // icon: 'fa fa-paper-plane',
        //   },
        // },
      },
      events: {
        label: 'Événements',
        tip: 'Liste des événements',
        link: '/:orgId/manage/events',
        icon: CalendarUpcomingIcon,
        sub: {
          soon: {
            label: 'À venir',
            tip: 'Événements à venir',
            link: '/:orgId/manage/events',
            // icon: 'fa fa-calendar',
          },
          pending: {
            label: 'En attente',
            tip: 'Événements en attente de validation',
            // icon: 'fa fa-calendar',
            link: '/:orgId/manage/events',
          },
          past: {
            label: 'Rétrospectives',
            tip: 'Événements passés',
            // icon: 'fa fa-images',
            link: '/:orgId/manage/events',
          },
        },
      },
      settings: {
        label: 'Paramètres',
        tip: "Paramètres de l'association",
        link: '/:orgId/manage/settings',
        icon: SettingsIcon,
        // icon: 'fa fa-cog',
        sub: {
          general: {
            label: "Vue d'ensemble",
            tip: "Informations générales de l'association",
            // icon: 'fa fa-info',
            link: '/:orgId/manage/settings',
          },
          roles: {
            label: 'Rôles',
            tip: 'Gestion des rôles',
            // icon: 'fa fa-fingerprint',
            link: '/:orgId/manage/roles',
          },
        },
      },
    },
  },
};
