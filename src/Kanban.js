import React, { useState } from 'react';
import styled from '@emotion/styled';
import { columnsFromBackend } from './KanbanData';
import { DragDropContext, Droppable } from 'react-beautiful-dnd';
import TaskCard from './TaskCard';
import { Button, Form, FormGroup, Input, Modal, ModalBody, ModalHeader } from 'reactstrap';
import { v4 as uuidv4 } from 'uuid';
import moment from 'moment';

const Container = styled.div`
  display: flex;
`;

const TaskList = styled.div`
  min-height: 100px;
  display: flex;
  flex-direction: column;
  background: #f3f3f3;
  min-width: 341px;
  border-radius: 5px;
  padding: 15px 15px;
  margin-right: 45px;
`;

const TaskColumnStyles = styled.div`
  margin: 8px;
  display: flex;
  width: 100%;
  min-height: 80vh;
`;

const Title = styled.span`
  color: #10957d;
  background: rgba(16, 149, 125, 0.15);
  padding: 2px 10px;
  border-radius: 5px;
  align-self: flex-start;
`;

const Kanban = () => {
  const [columns, setColumns] = useState(columnsFromBackend);
  var [modal_add, set_modal_add] = useState(false);
  var [modal_edit, set_modal_edit] = useState(false);
  var [title, set_title] = useState('');
  var [description, set_description] = useState('');
  var [id_column, set_id_column] = useState('');
  var [id_index, set_id_index] = useState('');

  const toggleModal = () => {
    set_modal_add(!modal_add)
  }

  const toggleModalEdit = () => {
    set_modal_edit(!modal_edit)
  }

  const pushAdd = (columnId, index) => {
    set_id_column(columnId)
    set_id_index(index)
    set_modal_add(true)
  }

  const pushEdit = (columnId, index, item) => {
    set_id_column(columnId)
    set_id_index(index)
    set_title(item.title)
    set_description(item.dec)
    set_modal_edit(true)
  }

  const onDragEnd = (result, columns, setColumns) => {
    if (!result.destination) return;
    const { source, destination } = result;
    if (source.droppableId !== destination.droppableId) {
      const sourceColumn = columns[source.droppableId];
      const destColumn = columns[destination.droppableId];
      const sourceItems = [...sourceColumn.items];
      const destItems = [...destColumn.items];
      const [removed] = sourceItems.splice(source.index, 1);
      destItems.splice(destination.index, 0, removed);
      setColumns({
        ...columns,
        [source.droppableId]: {
          ...sourceColumn,
          items: sourceItems,
        },
        [destination.droppableId]: {
          ...destColumn,
          items: destItems,
        },
      });
    } else {
      const column = columns[source.droppableId];
      const copiedItems = [...column.items];
      const [removed] = copiedItems.splice(source.index, 1);
      copiedItems.splice(destination.index, 0, removed);
      setColumns({
        ...columns,
        [source.droppableId]: {
          ...column,
          items: copiedItems,
        },
      });
    }
  };

  const onDelete = (columnId, index) => {
    const updatedColumns = { ...columns };

    // Check if columnId exists
    if (updatedColumns[columnId]) {
        updatedColumns[columnId].items = [
        ...updatedColumns[columnId].items.slice(0, index), // Get items before the index
        ...updatedColumns[columnId].items.slice(index + 1), // Get items after the index
        ];
    }
    setColumns(updatedColumns)
  }

  const onFinish = () => {
    const data = {
      id: uuidv4(),
      title,
      dec: description,
      Due_Date: moment().format('DD-MM-YYYY')
    }

    const updatedColumns = { ...columnsFromBackend };
    // Check if columnId exists
    if (updatedColumns[id_column]) {
      const items = [...updatedColumns[id_column].items];
      items.splice(id_index, 0, data);
      updatedColumns[id_column].items = items;
    }
    setColumns(updatedColumns)
    set_modal_add(false)
  }

  const onUpdate = () => {
    const data = {
      title,
      dec: description,
      Due_Date: moment().format('DD-MM-YYYY')
    }
    const updatedColumns = { ...columnsFromBackend };

    if (updatedColumns[id_column]) {
      const items = [...updatedColumns[id_column].items];
      if (id_index >= 0 && id_index < items.length) {
        items[id_index] = { ...items[id_index], ...data };
        updatedColumns[id_column].items = items;
      } else {
        console.error('Index out of range');
      }
    } else {
      console.error('Column ID not found');
    }
    setColumns(updatedColumns)
    set_modal_edit(false)
  }
  return (
    <div>
      <DragDropContext
        onDragEnd={(result) => onDragEnd(result, columns, setColumns)}
      >
        <Container>
          <TaskColumnStyles>
            {Object.entries(columns).map(([columnId, column], index) => {
              return (
                <Droppable key={columnId} droppableId={columnId}>
                  {(provided, snapshot) => (
                    <TaskList
                      ref={provided.innerRef}
                      {...provided.droppableProps}
                    >
                      <Title>{column.title}</Title>
                      {column.items.map((item, index) => (
                        <TaskCard 
                          key={item} 
                          item={item} 
                          index={index} 
                          onClick={(e) => {
                            onDelete(columnId, index)
                          }}
                          onClickEdit={(e) => {
                            pushEdit(columnId, index, item)
                          }}
                        />
                      ))}
                      {provided.placeholder}
                      <button className="btn btn-block btn-secondary" onClick={(e) => {
                        pushAdd(columnId, index)
                      }}>Add Task</button>
                    </TaskList>
                  )}
                </Droppable>
              );
            })}
          </TaskColumnStyles>
        </Container>
      </DragDropContext>
      <Modal
        isOpen={modal_add}
        toggle={() => toggleModal()}
        className={`modal-dialog-centered modal-lg`}
        key='modal_tambah'
        backdrop={'static'}
      >
        <ModalHeader toggle={toggleModal}>
          Add Data
        </ModalHeader>
        <ModalBody>
          <Form>
            <FormGroup>
              <label for='title'>Title <span style={{ color: "red" }}>*</span></label>
              <Input
                type='text'
                name='title'
                id='title'
                placeholder='Title'
                value={title}
                onChange={e => set_title(e.target.value)}
              />
            </FormGroup>
            <FormGroup>
              <label for='description'>Description <span style={{ color: "red" }}>*</span></label>
              <Input
                type='textarea'
                name='description'
                id='description'
                placeholder='description'
                value={description}
                onChange={e => set_description(e.target.value)}
              />
            </FormGroup>
            <Button color="success" onClick={onFinish}>Save</Button>
          </Form>
        </ModalBody>
      </Modal>
      <Modal
        isOpen={modal_edit}
        toggle={() => toggleModalEdit()}
        className={`modal-dialog-centered modal-lg`}
        key='modal_update'
        backdrop={'static'}
      >
        <ModalHeader toggle={toggleModalEdit}>
          Update Data
        </ModalHeader>
        <ModalBody>
          <Form>
            <FormGroup>
              <label for='title'>Title <span style={{ color: "red" }}>*</span></label>
              <Input
                type='text'
                name='title'
                id='title'
                placeholder='Title'
                value={title}
                onChange={e => set_title(e.target.value)}
              />
            </FormGroup>
            <FormGroup>
              <label for='description'>Description <span style={{ color: "red" }}>*</span></label>
              <Input
                type='textarea'
                name='description'
                id='description'
                placeholder='description'
                value={description}
                onChange={e => set_description(e.target.value)}
              />
            </FormGroup>
            <Button color="success" onClick={onUpdate}>Save</Button>
          </Form>
        </ModalBody>
      </Modal>
    </div>
  );
};

export default Kanban;
