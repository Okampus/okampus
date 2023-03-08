import { CreateEventForm } from '../../components/Forms/CreateEventForm';

import { SmallCalendar } from '@okampus/ui/molecules';
import { NavigationContext } from '@okampus/ui/hooks';

import { ToastType } from '@okampus/shared/types';
import { motion } from 'framer-motion';
import { nanoid } from 'nanoid';
import { useContext } from 'react';

export function EventManageView() {
  const currentId = nanoid(21);
  const { showModal, hideModal, addNotification } = useContext(NavigationContext);

  return (
    <div className="p-view flex gap-10">
      <div className="flex-shrink-0 w-64 flex flex-col gap-4">
        <SmallCalendar />
        <button
          className="hover:cursor-pointer rounded-lg bg-opposite text-opposite py-2 px-3 text-sm font-semibold"
          onClick={() =>
            showModal({
              title: 'Nouvel événement',
              content: (
                <motion.div layoutId={currentId}>
                  <CreateEventForm
                    onSubmit={() => {
                      hideModal();
                      addNotification({
                        type: ToastType.Success,
                        message: "Événement soumis ! L'admininistration validera l'évènement sous peu.",
                        timeout: 6000,
                      });
                    }}
                  />
                </motion.div>
              ),
            })
          }
        >
          Créer un événement
        </button>
      </div>
      <div></div>
      <div className="flex flex-col gap-10">
        <div className="flex flex-col gap-4 text-1">
          <h1 className="text-xl font-medium">Événements qui arrivent</h1>
          <div className="rounded-lg border border-color-3 p-4 bg-2">
            Lorem ipsum, dolor sit amet consectetur adipisicing elit. Dicta, velit.
          </div>
          <div className="rounded-lg border border-color-3 p-4 bg-2">
            Explicabo reprehenderit necessitatibus voluptatem tenetur dolore quidem soluta eaque maiores.
          </div>
          <div className="rounded-lg border border-color-3 p-4 bg-2">
            Quas nobis iste harum possimus, accusamus voluptas dolores veritatis aspernatur.
          </div>
        </div>
        <div className="flex flex-col gap-4 text-1">
          <h1 className="text-xl font-medium">Événements en attente de validation</h1>

          <div className="rounded-lg border border-color-3 p-4 bg-2">
            Lorem ipsum, dolor sit amet consectetur adipisicing elit. Dicta, velit.
          </div>
          <div className="rounded-lg border border-color-3 p-4 bg-2">
            Explicabo reprehenderit necessitatibus voluptatem tenetur dolore quidem soluta eaque maiores.
          </div>
          <div className="rounded-lg border border-color-3 p-4 bg-2">
            Quas nobis iste harum possimus, accusamus voluptas dolores veritatis aspernatur.
          </div>
        </div>
      </div>
    </div>
  );
}
