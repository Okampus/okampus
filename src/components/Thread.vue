<template>
  <div class="border container">
    <div class="header">
        <div class="titre">
            <h1 class = "title is-1"><span class="titletag">[REPORT]</span> <span class="titreText">Problème matériel en salle 402</span></h1>
        </div>
        <div class="statut">
            <p> Etat - Hot - Upvote - New ? </p>
        </div>
    </div>
    <div class="border tile is-ancestor m-0">
      <div class="border tile is-vertical is-2 is-parent">
        <div class="border is-child" style="height: 200px"></div>
        <div class="border tile is-child"></div>
      </div>
      <div class="border tile is-vertical is-7 is-parent">
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
            <div class="box assign m-0 mt-3 bg-1-important text-2-important">Assigné à: PM</div>
            <div class="box collabBox m-0 mt-3 bg-1-important text-2-important">
                Collaborateurs:
                <div v-for="c in collaborateurs" v-bind:key="c">
                    <img class="avatarCollab" v-bind:src=c.avatar alt="">
                </div>
            </div>
            <div class="box tagBox m-0 mt-3 bg-1-important text-2-important">
                Tags:<br>
                <div v-for="t in tags" v-bind:key="t">
                    <div class="tagItem">{{t}}</div>
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
      ]

    }
  }
})
</script>

<style scoped>
.border {
  /*border: 1px solid white;*/
}

.no-radius {
  border-radius: 0;
}

.pp {
  position: block;
}

.box {
  /*box-shadow: 2px 2px 2px 2px rgba(0, 0, 0, 0.2);*/
  border: 1px solid rgba(0, 0, 0, 0.2);
}

.ticketTitle{
  font-size : 60px;
}

.titletag {
  text-align: bold;
  color : blue;
}

.msg {
  position: block;
}

.titre {
    margin: 5px;
    margin-left: 20px;
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

.titreText{
    color: white;
    width: 75%;
    padding-right:3% ;
}

.header{
    margin-top: 25px;
    display: flex;
    width: 100%;
}

.statut{
    width: 25%;
    font-size: 30px;
    padding-left: 3% ;
    color: white;
}

.avatarCollab {
    width: 50%;
    border-radius: 180px;
}

.collabBox{
    display: flex;
}

.tagItem{
    border: white solid 1px;
    border-radius: 5px;
}

.tagBox {
  display: flex;
}
</style>
