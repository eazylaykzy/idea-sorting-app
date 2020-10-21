import React from "react";
import {Droppable} from 'react-beautiful-dnd'
import Task from "./Task";
import List from "@material-ui/core/List";

const Column = ({column, tasks}) => {

  return (
    <Droppable droppableId={column.id} type='task'>
      {(provided, snapshot) =>
        <List
          ref={provided.innerRef}
          {...provided.droppableProps}
          {...snapshot.isDraggingOver}
        >
          {tasks.map((task, index) => (
            <Task key={task.id} task={task} index={index}/>
          ))}
          {provided.placeholder}
        </List>
      }
    </Droppable>
  )
};

export default Column;