import React from 'react';
import { Draggable } from 'react-beautiful-dnd';
import styled from '@emotion/styled';

const TaskInformation = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: flex-start;
  padding: 0 15px;
  min-height: 106px;
  border-radius: 5px;
  max-width: 311px;
  /* background: ${({ isDragging }) =>
    isDragging ? 'rgba(255, 59, 59, 0.15)' : 'white'}; */
  background: white;
  margin-top: 15px;

  .secondary-details {
    display: flex;
    justify-content: space-between;
    align-items: center;
    width: 100%;
    font-size: 12px;
    font-weight: 400px;
    color: #7d7d7d;
  }
  /* .priority{ */
  /* margin-right: 12px; */
  /* align-self: center;
    svg{
      width: 12px !important;
      height: 12px !important;
      margin-right: 12px; */
  /* margin-top: 2px; */
  /* } */
  /* } */
`;

const TaskCard = ({ item, index, onClick, onClickEdit }) => {
  return (
    <Draggable key={item.id} draggableId={item.id} index={index}>
      {(provided) => (
        <div
          ref={provided.innerRef}
          {...provided.draggableProps}
          {...provided.dragHandleProps}
        >
          <TaskInformation>
            <div className='row'>
              <div className='col-6 text-start'>
                <p>{item.title}</p>
              </div>
              <div className='col-4'>
                  <div className="text-right">
                    <button className="btn btn-danger btn-sm" onClick={onClick}>Delete</button>
                  </div>
              </div>
              <div className='col-1'>
                  <div className="text-right">
                    <button className="btn btn-warning btn-sm" onClick={onClickEdit}>Edit</button>
                  </div>
              </div>
            </div>
            <p>{item.dec}</p>
            <div className="secondary-details">
              <p>
                <span>
                  {new Date(item.Due_Date).toLocaleDateString('en-us', {
                    month: 'short',
                    day: '2-digit',
                  })}
                </span>
              </p>
            </div>
          </TaskInformation>
        </div>
      )}
    </Draggable>
  );
};

export default TaskCard;
