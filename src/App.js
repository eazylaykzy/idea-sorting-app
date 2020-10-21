import React, {useState} from 'react';
import {DragDropContext, Droppable, Draggable} from 'react-beautiful-dnd'
import {sortData} from "./sort-data";
import Column from './Column';
import {makeStyles} from '@material-ui/core/styles';
import SideBar from "./SideBar";
import Paper from "@material-ui/core/Paper";
import Grid from "@material-ui/core/Grid";
import Container from "@material-ui/core/Container";
import Typography from "@material-ui/core/Typography";
import TextField from "@material-ui/core/TextField";
import {fade} from "@material-ui/core";

const useStyles = makeStyles((theme) => ({
  containerStyle: {
    margin: '5px',
  },
  textField: {
    '& .MuiOutlinedInput-input': {
      padding: '8px 4px',
      '&:focus': {
        boxShadow: `${fade(theme.palette.primary.main, 0.25)} 0 0 0 0.2rem`,
        borderColor: 'black',
      },
    },
    '& input:valid:focus + fieldset': {
      borderColor: '#4caf50',
    },
  },
  categoryCard: {
    visibility: 'hidden'
  },
  categoryCardOnHover: {
    border: '2px dashed #0000001f;'
  },
  cardBar: {
    display: 'flex',
    flexWrap: 'wrap',
    backgroundColor: '#4caf50',
    '& > *': {
      margin: theme.spacing(1),
      width: '100%',
      height: theme.spacing(2),
      backgroundColor: '#4caf50',
    },
  },
}));

export default function App() {
  const classes = useStyles();
  const [initState, setState] = useState(sortData);

  const onDragStart = () => {
    // console.log("onDragStart props => ", props)
    // document.body.style.color = 'orange';
    // document.body.style.transition = 'background-color 0.2s ease';
  }

  const onDragUpdate = update => {
    // console.log("update => ", update)
    const {destination, source} = update;
    /*const opacity = destination
      ? destination.index / Object.keys(initState.tasks).length
      : 0;
    document.body.style.backgroundColor = `rgba(153, 141, 217, ${opacity})`*/
    if (destination && source.droppableId !== destination.droppableId) {
      setState({...initState, ...initState.columns[destination.droppableId].paperVisibility = true})
    }
  }

  const onDragEnd = result => {
    // console.log("onDragEnd result => ", result)
    document.body.style.color = 'inherit';
    document.body.style.backgroundColor = 'inherit';

    const {destination, source, draggableId, type} = result;

    if (!destination) {
      return;
    }

    if (destination.droppableId === source.droppableId && destination.index === source.index) {
      return;
    }

    if(type === 'column') {
      const newColumnOrder = Array.from(initState.columnOrder);
      newColumnOrder.splice(source.index, 1);
      newColumnOrder.splice(destination.index, 0, draggableId);

      const newState = {
        ...initState,
        columnOrder: newColumnOrder,
      };
      setState(newState);
      return;
    }

    setState({...initState, ...initState.columns[destination.droppableId].cardVisibility = true});

    const start = initState.columns[source.droppableId];
    const finish = initState.columns[destination.droppableId];

    if (start === finish) {
      const newTaskIds = Array.from(start.taskIds);
      newTaskIds.splice(source.index, 1);
      newTaskIds.splice(destination.index, 0, draggableId);

      const newColumn = {
        ...finish,
        taskIds: newTaskIds,
      };

      const newState = {
        ...initState,
        columns: {
          ...initState.columns,
          [newColumn.id]: newColumn,
        },
      };

      setState(newState);
      return;
    }

    // Moving from one list to another
    const startTaskIds = Array.from(start.taskIds);
    startTaskIds.splice(source.index, 1);
    const newStart = {
      ...start,
      taskIds: startTaskIds,
    };

    const finishTaskIds = Array.from(finish.taskIds);
    finishTaskIds.splice(destination.index, 0, draggableId);
    const newFinish = {
      ...finish,
      taskIds: finishTaskIds,
    };

    const newState = {
      ...initState,
      columns: {
        ...initState.columns,
        [newStart.id]: newStart,
        [newFinish.id]: newFinish,
      },
    };

    setState(newState);
  }

  const onChangeCatName = e => {
    console.log("Event is => ", e.target.value);
  }

  const mainColumn = () => {
    return (
      <>
        {
          initState.mainColumn.map((columnId) => {
            const column = initState.columns[columnId];
            const tasks = column.taskIds.map(taskId => initState.tasks[taskId]);

            return (
              <div key={column.id} className={classes.containerStyle}>
                <Typography color='inherit' noWrap
                            variant='h5'>{`${column.title} (${column.taskIds.length})`}</Typography>
                <Column column={column} tasks={tasks}/>
              </div>
            )
          })
        }
      </>
    )
  }

  return (
    <React.Fragment>
      <DragDropContext
        onDragUpdate={onDragUpdate}
        onDragStart={onDragStart}
        onDragEnd={onDragEnd}
      >
        <SideBar column={mainColumn()}>
          <Droppable
            droppableId='all-cards-column'
            direction='horizontal'
            type='column'
          >
            {(provided) => (
              <Container
                ref={provided.innerRef}
                {...provided.droppableProps}
              >
                <Grid style={{paddingTop: '8rem'}} container spacing={3}>
                  {/* List Items */}
                  {
                    initState.columnOrder.map((columnId, index) => {
                      const column = initState.columns[columnId];
                      const tasks = column.taskIds.map(taskId => initState.tasks[taskId]);

                      return (
                        <Draggable
                          draggableId={columnId}
                          index={index}
                          key={columnId}
                        >
                          {(provided) => (
                            <Grid
                              ref={provided.innerRef}
                              {...provided.draggableProps}
                              key={columnId}
                              item
                              xs={12} md={6} lg={4}>
                              <Paper
                                style={{visibility: column.paperVisibility ? '' : 'hidden'}}
                                className={`${!column.cardVisibility && classes.categoryCardOnHover}`}
                                variant="outlined"
                                square
                              >
                                <div
                                  {...provided.dragHandleProps}
                                  className={classes.cardBar}>
                                  {/*<Paper elevation={0}/>*/}
                                  <Typography style={{color: 'white'}}>Drag to re-arrange</Typography>
                                </div>
                                {/*Drop The Card And Create The Category*/}
                                <div
                                  className={`${classes.containerStyle} ${!column.cardVisibility && classes.categoryCard}`}>
                                  <TextField
                                    className={classes.textField}
                                    fullWidth
                                    onChange={onChangeCatName}
                                    // value={column.title}
                                    id="outlined-basic"
                                    placeholder='Enter Category Name'
                                    variant="outlined"/>
                                  <Column key={column.id} column={column} tasks={tasks}/>
                                </div>
                              </Paper>
                            </Grid>
                          )}
                        </Draggable>
                      )
                    })
                  }
                </Grid>
                {provided.placeholder}
              </Container>
            )}
          </Droppable>
        </SideBar>
      </DragDropContext>
    </React.Fragment>
  );
};

