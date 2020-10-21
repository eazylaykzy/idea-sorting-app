import React, {useState} from 'react';
import {Draggable} from 'react-beautiful-dnd'
import ListItem from "@material-ui/core/ListItem";
import ListItemText from "@material-ui/core/ListItemText";
import makeStyles from "@material-ui/core/styles/makeStyles";

export default function Task({task, index}) {
  const [isDragging, setIsDragging] = useState(false);

  const useStyles = makeStyles(() => ({
    listStyle: {
      border: '1px solid grey',
      borderRadius: '5px',
      padding: '3px',
      marginBottom: '1px',
      transition: 'backgroundColor 0.3s ease',
      backgroundColor: isDragging ? 'grey' : 'white',

    },
  }));
  const classes = useStyles();

  return (
    <Draggable draggableId={task.id} index={index}>
      {(provided, snapshot) => {
        setTimeout(() => setIsDragging(snapshot.isDragging), 100);
        return (
          <ListItem
            className={classes.listStyle}
            button
            ref={provided.innerRef}
            {...provided.draggableProps}
            {...provided.dragHandleProps}
          >
            <ListItemText primary={task.content}/>
          </ListItem>
        )
      }}
    </Draggable>
  )
}