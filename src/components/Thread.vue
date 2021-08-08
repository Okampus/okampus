<template>
  <div class="border container is-link">
    <div class="border header">
      <div class="border">
        <div class="border title is-1 headTitle">
          <span class="blue">[REPORT]</span>
          <span class="text-1-important">Problème matériel en salle 402</span>
        </div>
        <div class="headerInfos text-1-important">08/08/2021-Eleve Lambda</div>
      </div>
      <!-- <div class="box m-0 mt-3 bg-1-important text-2-important"></div> -->
    </div>
    <div class="border tile is-ancestor m-0">
      <div class="border tile is-vertical is-3 is-parent">
        <div class="border tile is-child">
          <div class="timeline is-rtl text-1">
            <header class="timeline-header">
              <span class="tag is-medium is-primary">Start</span>
            </header>
            <div
              v-for="advancement in timeline_advancements"
              v-bind:key="advancement"
              v-bind:class="{'is-danger': !advancement.status,'is-warning':advancement.status==1 ,'is-primary': advancement.status==2}"
              class="timeline-item"
            >
              <div class="timeline-marker"
              v-bind:class="{'is-danger': !advancement.status,'is-warning':advancement.status==1 ,'is-primary': advancement.status==2}"></div>
              <div class="timeline-content">
                <p class="heading">{{advancement.date}}</p>
                <p class="timeline-advancement-comment">{{advancement.comment}}</p>
              </div>
            </div>
            <header class="timeline-header">
              <span class="tag is-medium is-primary">End</span>
            </header>
          </div>
          <div class="border tile is-child"></div>
        <div class="box m-0 mt-3 bg-1-important text-2-important">Jambon</div>
        </div>
      </div>
      <div class="border tile is-vertical is-6 is-parent">
        <div class="border tile is-child"></div>
        <div class="border tile is-child">
          <div
            v-for="message in messages"
            v-bind:key="message"
            class="responseMessages"
          >
            <div class="box m-0 mt-3 bg-1-important text-2-important">
              <article class="media">
                <div class="media-left">
                  <font-awesome-icon
                    icon="caret-up"
                    :style="{ 'font-size': '16px' }"
                  />
                  <br />
                  {{ message.upvotes }}
                  <br />
                  <font-awesome-icon
                    icon="caret-down"
                    :style="{ 'font-size': '16px' }"
                  />
                </div>
                <div class="media-content">
                  <div class="has-text-weight-bold">{{ message.author }}</div>
                  <p>
                    {{ message.text }}
                  </p>

                  <nav class="level is-mobile icon">
                    <div class="level-left">
                      <a class="level-item">
                        <span class="icon is-small">
                          <font-awesome-icon
                            icon="at"
                            :style="{ 'font-size': '16px' }"
                          />
                        </span>
                      </a>
                      <a class="level-item">
                        <span class="icon is-small">
                          <font-awesome-icon
                            icon="comment-alt"
                            :style="{ 'font-size': '16px' }"
                          />
                        </span>
                      </a>
                      <a class="level-item">
                        <span class="icon is-small">
                          <font-awesome-icon
                            icon="plus"
                            :style="{ 'font-size': '16px' }"
                          />
                        </span>
                      </a>
                      <a class="level-item">
                        <span class="icon is-small">
                          <font-awesome-icon
                            icon="flag"
                            :style="{ 'font-size': '16px' }"
                          />
                        </span>
                      </a>
                    </div>
                  </nav>
                </div>
              </article>
            </div>
            <div
              class="commentary"
              v-for="reply_message in message.replies"
              v-bind:key="reply_message"
            >
              <div class="box bg-1-important text-2-important py-2 no-radius">
                {{ reply_message.text }} –
                <span class="has-text-weight-bold">{{
                  reply_message.author
                }}</span>
                <nav class="level is-mobile icon">
                  <div class="level-left">
                    <a class="level-item">
                      <span class="icon is-small">
                        <font-awesome-icon
                          icon="at"
                          :style="{ 'font-size': '16px' }"
                        />
                      </span>
                    </a>
                    <a class="level-item">
                      <span class="icon is-small">
                        <font-awesome-icon
                          icon="plus"
                          :style="{ 'font-size': '16px' }"
                        />
                      </span>
                    </a>
                    <a class="level-item">
                      <span class="icon is-small">
                        <font-awesome-icon
                          icon="flag"
                          :style="{ 'font-size': '16px' }"
                        />
                      </span>
                    </a>
                  </div>
                </nav>
              </div>
            </div>
          </div>
        </div>
        <div class="border tile is-child"></div>
      </div>
      <div class="border tile is-vertical is-3 is-parent">
        <div class="border tile is-child">
          <div class="box assign m-0 mt-3 bg-1-important text-2-important">
            Assigné à: PM
          </div>
          <div class="box collabBox m-0 mt-3 bg-1-important text-2-important">
            Collaborateurs:
            <div v-for="c in collaborateurs" v-bind:key="c">
              <img class="avatarCollab" v-bind:src="c.avatar" alt="" />
            </div>
          </div>
          <div class="box m-0 mt-3 bg-1-important text-2-important">
            Tags:<br />
            <div v-for="t in tags" v-bind:key="t">
              <div class="tag bg-opp-1-important text-opp-1-important">{{ t }}</div>
            </div>
          </div>
        </div>
        <div class="border tile is-child"></div>
      </div>
    </div>
  </div>
</template>

<script lang="js">
import { defineComponent } from 'vue'

export default defineComponent({
  name: 'Thread',
  props: {},
  methods: {},

  data () {
    return {
      messages: [
        {
          text: 'Le troisième ordinateur de la deuxième rangée ne fonctionne plus',
          author: 'Timothée',
          date: '22/02/2020',
          upvotes: 1023,
          replies: [
            {
              text: 'Vraiment ?',
              author: 'Ivan Stepanian',
              date: '23/02/2021',
              upvotes: 1
            },
            {
              text: 'Plusieurs étudiants ont observé ce problème',
              author: 'CMB',
              date: '23/02/2021',
              upvotes: 1
            }
          ]
        },

        {
          text: 'Je confirme',
          author: 'JoDu75',
          date: '10/12/2019',
          upvotes: 0,
          replies: [
            {
              text: "Yes, j'ai une preuve en image",
              author: 'Jean',
              date: '12/02/2021',
              upvotes: 547
            }
          ]
        },

        {
          text: "Qu est ce qu'un steak qui n'est pas un steak ?.... une pastèque lol",
          author: 'Steak',
          date: '10/12/2019',
          upvotes: 0
        },

        {
          text: 'Qu est ce qui est jaune et qui attends ?',
          author: 'iel',
          date: '10/12/2019',
          upvotes: 0
        },

        {
          text: "Une carte Google Play d'une valeur de 500€ est cachée quelque part sur Horizon",
          author: 'Code Forlan',
          date: '10/12/2019',
          upvotes: 0
        }
      ],

      collaborateurs: [
        {
          pseudo: 'Tim au Thé',
          avatar: 'https://hiphopcorner.fr/wp-content/uploads/2019/11/EJ5fnTmWsAAOwF7-3.jpg'
        },

        {
          pseudo: 'Unaxe',
          avatar: 'https://ichef.bbci.co.uk/news/976/cpsprodpb/7727/production/_103330503_musk3.jpg'
        }
      ],

      tags: [
        'Problème matériel',
        'Ordinateur',
        'Prioritaire'
      ],

      timeline_advancements: [
        {
          date: 'SEPT. 2016',
          comment: 'Validé',
          status: 2
        },
        {
          date: 'DEC. 2016',
          comment: 'En Cours',
          status: 1
        },
        {
          date: 'JAN. 2017',
          comment: 'Pas Commencé',
          status: 0
        }
      ]

    }
  }
})
</script>

<style scoped>
.border {
  /* border: 1px solid white; */
}

.no-radius {
  border-radius: 0;
}

.pp {
  position: block;
}

.box {
  /*box-shadow: 2px 2px 2px 2px rgba(0, 0, 0, 0.2);*/
  border: 3px solid rgba(0, 0, 0, 0.2);
}

.timeline-advancement-comment{
  font-size : 10px;
}

.ticketTitle {
  font-size: 60px;
}

.titletag {
  text-align: bold;
  color: blue;
}

.headTitle{
  padding-bottom: 0%;
  margin-bottom: 0%;
  font-size: 50px;
}

.headerInfos{
  padding: 0%;
  padding-left: 2%;
  margin: 0%;
  font-size: 20px;
  font-weight: bold;
}

.msg {
  position: block;
}

.titre {
  margin: 5px;
}

.imgprofil {
  border-radius: 180px;
  padding: 10%;
}

.responseMessages {
  margin-bottom: 5px;
}

.icon {
  margin-top: 5px;
}

.commentary {
  margin-top: 5px;
  margin-left: 5%;
  padding: 0;
}

.align {
  height: 90%;
  width: 100%;
  display: flex;
}

.topicMsg {
  border: lightgray solid 1px;
  margin-left: 5%;
  margin-top: 5%;
  height: 85%;
  margin-bottom: 5%;
}

.limite {
  display: flex;
  width: 100%;
  height: 10%;
}

.titreText {
  padding-right: 3%;
}

.header {
  margin-top: 25px;
  display: flex;
  width: 100%;
}

.avatarCollab {
  width: 50%;
  border-radius: 180px;
}

.collabBox {
  display: flex;
}

.tagItem {
  border: white solid 1px;
  border-radius: 5px;
}

.tagBox {
  display: flex;
}
</style>
