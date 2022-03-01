import { FC, KeyboardEvent, useCallback } from 'react';

import {
  DragDropContext,
  Droppable,
  Draggable,
  DropResult,
} from 'react-beautiful-dnd';

import { Block } from '@/types';

import { Editable, Flex } from '@/components/ui';
import { cloneDeep, findIndex } from 'lodash';

interface PageBlocksRenderProps {
  blocks: Block[];
  focusedBlock?: Block;
  onFocusBlock: (block: Block) => void;
  onInsertBlock: (blockIndex: number) => void;
  onUpdateBlock: (block: Block, value: string) => void;
  onDeleteBlock: (block: Block) => void;
  onReorderBlocks: (blocks: Block[]) => void;
}

export const PageBlocksRender: FC<PageBlocksRenderProps> = ({
  blocks,
  focusedBlock,
  onInsertBlock,
  onUpdateBlock,
  onDeleteBlock,
  onFocusBlock,
  onReorderBlocks,
}) => {
  const getBlockPlaceholder = useCallback(
    (block: Block) =>
      block?.id === focusedBlock?.id ? 'Insert a text...' : undefined,
    [focusedBlock]
  );

  const handleBlockDrag = (dropResult: DropResult) => {
    const { destination, draggableId } = dropResult;

    const clonedBlocks = cloneDeep(blocks);
    const foundedBlock = clonedBlocks.find(({ id }) => id === draggableId);

    if (foundedBlock) {
      const blockIndex = findIndex(clonedBlocks, {
        id: foundedBlock.id,
      });

      if (
        destination &&
        (destination?.droppableId !== foundedBlock?.id ||
          destination?.index !== blockIndex)
      ) {
        clonedBlocks.splice(blockIndex, 1);
        clonedBlocks.splice(destination.index, 0, foundedBlock);

        onReorderBlocks(clonedBlocks);
      }
    }
  };

  const handleBlockShortcut = (
    event: KeyboardEvent<HTMLSpanElement>,
    blockIndex: number
  ) => {
    const {
      key,
      currentTarget: { textContent },
    } = event;

    if (key === 'Enter') {
      event.preventDefault();
      onInsertBlock(blockIndex + 1);
    }

    if (
      key === 'Backspace' &&
      textContent === '' &&
      focusedBlock &&
      blocks?.length > 1
    ) {
      onDeleteBlock(focusedBlock);
    }

    if (key === 'Delete' && focusedBlock && blocks?.length > 1) {
      event.preventDefault();
      onDeleteBlock(focusedBlock);
    }

    if (key === 'ArrowUp') {
      const newFocusedBlock = blocks[blockIndex - 1];

      if (newFocusedBlock) onFocusBlock(newFocusedBlock);
    }

    if (key === 'ArrowDown') {
      const newFocusedBlock = blocks[blockIndex + 1];

      if (newFocusedBlock) onFocusBlock(newFocusedBlock);
    }
  };

  return (
    <DragDropContext onDragEnd={(result) => handleBlockDrag(result)}>
      <Droppable droppableId="main-column">
        {(provided) => (
          <Flex
            {...provided.droppableProps}
            ref={provided.innerRef}
            css={{
              gridGap: '$sm',
              flexDirection: 'column',
            }}
          >
            {blocks.map((block, index) => (
              <Draggable index={index} draggableId={block.id} key={block.id}>
                {(provided) => (
                  <Flex
                    {...provided.draggableProps}
                    ref={provided.innerRef}
                    css={{
                      position: 'relative',
                      paddingLeft: '$sm',
                      color:
                        focusedBlock?.id === block.id
                          ? '$gray500'
                          : '$transparent',
                      '&:hover': {
                        color: '$gray500',
                      },
                    }}
                  >
                    <Flex
                      {...provided.dragHandleProps}
                      tabIndex={undefined}
                      css={{
                        top: '4px',
                        left: '-18px',
                        cursor: 'grab',
                        outline: 'none',
                        position: 'absolute',
                        alignItems: 'center',
                        justifyContent: 'center',
                        '&:focus': {
                          outline: 'none',
                        },
                      }}
                    >
                      <svg
                        width="18"
                        height="18"
                        viewBox="0 0 15 15"
                        fill="none"
                        xmlns="http://www.w3.org/2000/svg"
                      >
                        <path
                          d="M5.5 4.625C6.12132 4.625 6.625 4.12132 6.625 3.5C6.625 2.87868 6.12132 2.375 5.5 2.375C4.87868 2.375 4.375 2.87868 4.375 3.5C4.375 4.12132 4.87868 4.625 5.5 4.625ZM9.5 4.625C10.1213 4.625 10.625 4.12132 10.625 3.5C10.625 2.87868 10.1213 2.375 9.5 2.375C8.87868 2.375 8.375 2.87868 8.375 3.5C8.375 4.12132 8.87868 4.625 9.5 4.625ZM10.625 7.5C10.625 8.12132 10.1213 8.625 9.5 8.625C8.87868 8.625 8.375 8.12132 8.375 7.5C8.375 6.87868 8.87868 6.375 9.5 6.375C10.1213 6.375 10.625 6.87868 10.625 7.5ZM5.5 8.625C6.12132 8.625 6.625 8.12132 6.625 7.5C6.625 6.87868 6.12132 6.375 5.5 6.375C4.87868 6.375 4.375 6.87868 4.375 7.5C4.375 8.12132 4.87868 8.625 5.5 8.625ZM10.625 11.5C10.625 12.1213 10.1213 12.625 9.5 12.625C8.87868 12.625 8.375 12.1213 8.375 11.5C8.375 10.8787 8.87868 10.375 9.5 10.375C10.1213 10.375 10.625 10.8787 10.625 11.5ZM5.5 12.625C6.12132 12.625 6.625 12.1213 6.625 11.5C6.625 10.8787 6.12132 10.375 5.5 10.375C4.87868 10.375 4.375 10.8787 4.375 11.5C4.375 12.1213 4.87868 12.625 5.5 12.625Z"
                          fill="currentColor"
                          fillRule="evenodd"
                          clipRule="evenodd"
                        ></path>
                      </svg>
                    </Flex>
                    <Editable
                      size="md"
                      id={`block-${block.id}`}
                      placeholder={getBlockPlaceholder(block)}
                      onKeyDown={(event) => handleBlockShortcut(event, index)}
                      onFocus={() => onFocusBlock(block)}
                      onBlur={({ currentTarget }) =>
                        onUpdateBlock(block, currentTarget.textContent || '')
                      }
                    >
                      {block.content}
                    </Editable>
                  </Flex>
                )}
              </Draggable>
            ))}
            {provided.placeholder}
          </Flex>
        )}
      </Droppable>
    </DragDropContext>
  );
};
