import { useCallback, useEffect, useMemo, useState } from 'react';

import type { NextPage } from 'next';
import { cloneDeep, find, findIndex, set } from 'lodash';
import { v4 as uuidv4 } from 'uuid';
import { useRouter } from 'next/router';
import NextLink from 'next/link';

import { Block, Page } from '@/types';

import { Editable, Flex, Text } from '@/components/ui';
import { PageBlocksRender } from '@/components/composition/Page';

import { useLocalStorage } from '@/hooks/utils';

const Page: NextPage = () => {
  const router = useRouter();

  const [pages, setPages] = useLocalStorage<Page[]>('noty:pages', []);

  const [blocks, setBlocks] = useState<Block[]>([]);
  const [pageTitle, setPageTitle] = useState('');
  const [focusedBlock, setFocusedBlock] = useState<Block>();

  const getCurrentPage = useMemo(
    () => find(pages, { id: router.query?.pageId as string }),
    [pages, router.query?.pageId]
  );

  const handlePageUpdate = useCallback(() => {
    const clonedPages = cloneDeep(pages);
    const clonedPage = cloneDeep(getCurrentPage);

    const pageIndex = findIndex(clonedPages, { id: clonedPage?.id });

    if (clonedPage) {
      clonedPage.title = pageTitle;
      clonedPage.blocks = blocks;

      clonedPages.splice(pageIndex, 1, clonedPage);

      setPages(clonedPages);
    }
  }, [pages, getCurrentPage, pageTitle, blocks, setPages]);

  const handlePageTitleUpdate = (title: string) => {
    setPageTitle(title);
    handlePageUpdate();
  };

  const handleBlockChange = (block: Block, content: string) => {
    setBlocks((blocks) =>
      blocks.map((currentBlock) =>
        currentBlock.id === block.id ? { ...block, content } : currentBlock
      )
    );

    handlePageUpdate();
  };

  const handleBlockInsert = (blockIndex: number) => {
    const clonedBlocks = cloneDeep(blocks);

    const newBlock = {
      id: uuidv4(),
      content: '',
    };

    clonedBlocks.splice(blockIndex, 0, newBlock);

    setBlocks(clonedBlocks);
    setFocusedBlock(newBlock);

    handlePageUpdate();
  };

  const handleBlockFocus = (block: Block) => {
    const focusedBlock = document.getElementById(`block-${block.id}`);

    setFocusedBlock(block);
    focusedBlock?.focus();
  };

  const handleBlockDelete = (block: Block) => {
    const currentBlockIndex = findIndex(blocks, { id: block.id });
    const previousBlock = blocks[currentBlockIndex - 1];

    setBlocks((blocks) =>
      blocks.filter((currentBlock) => currentBlock.id !== block.id)
    );

    if (previousBlock) {
      const blockBefore = document.getElementById(`block-${previousBlock.id}`);

      blockBefore?.focus();
    }

    handlePageUpdate();
  };

  useEffect(() => {
    if (getCurrentPage?.title && pageTitle === '')
      setPageTitle(getCurrentPage.title);

    if (getCurrentPage?.blocks && blocks?.length === 0)
      setBlocks(getCurrentPage?.blocks);

    if (getCurrentPage?.blocks.length === 0) {
      const newBlock = {
        id: uuidv4(),
        content: '',
      };

      setBlocks(() => [newBlock]);
      setFocusedBlock(newBlock);

      handlePageUpdate();
    }
  }, [getCurrentPage, blocks, pageTitle, handlePageUpdate]);

  useEffect(() => {
    const element = document.getElementById(`block-${focusedBlock?.id}`);
    element?.focus();
  }, [focusedBlock]);

  return (
    <Flex
      css={{
        width: '100%',
        height: '100%',
        background: '$gray900',
        justifyContent: 'center',
        alignItems: 'center',
        overflow: 'auto',
        backgroundImage: 'radial-gradient(#131313 1px, transparent 0)',
        backgroundSize: '8px 8px',
        backgroundPosition: '-19px -19px',
        position: 'relative',
      }}
    >
      <NextLink passHref href="/pages">
        <Flex
          css={{
            top: '16px',
            left: '16px',
            color: '$gray500',
            cursor: 'pointer',
            border: '1px solid $gray800',
            padding: '$sm',
            position: 'absolute',
            alignItems: 'center',
            justifyContent: 'center',
            transitionDuration: '0.2s',

            '&:hover': {
              border: '1px solid $gray700',
            },
          }}
        >
          <svg
            width="16"
            height="16"
            viewBox="0 0 16 16"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              d="M8.81809 4.18179C8.99383 4.35753 8.99383 4.64245 8.81809 4.81819L6.13629 7.49999L8.81809 10.1818C8.99383 10.3575 8.99383 10.6424 8.81809 10.8182C8.64236 10.9939 8.35743 10.9939 8.1817 10.8182L5.1817 7.81819C5.09731 7.73379 5.0499 7.61933 5.0499 7.49999C5.0499 7.38064 5.09731 7.26618 5.1817 7.18179L8.1817 4.18179C8.35743 4.00605 8.64236 4.00605 8.81809 4.18179Z"
              fill="currentColor"
              fillRule="evenodd"
              clipRule="evenodd"
            />
          </svg>
        </Flex>
      </NextLink>
      <Flex
        css={{
          width: '100%',
          height: '100%',
          maxWidth: '720px',
          padding: '$lg $md',
          flexDirection: 'column',
          gridGap: '$sm',
          overflow: 'auto',
          '&::-webkit-scrollbar': {
            width: '0px',
            background: '$transparent',
          },
        }}
      >
        <Editable
          size="lg"
          weight="semibold"
          placeholder="Insert title..."
          css={{ paddingLeft: '$sm' }}
          onBlur={({ currentTarget }) =>
            handlePageTitleUpdate(currentTarget?.textContent || '')
          }
        >
          {pageTitle}
        </Editable>
        <PageBlocksRender
          blocks={blocks}
          focusedBlock={focusedBlock}
          onInsertBlock={(blockIndex) => handleBlockInsert(blockIndex)}
          onUpdateBlock={(block, value) => handleBlockChange(block, value)}
          onDeleteBlock={(block) => handleBlockDelete(block)}
          onFocusBlock={(block) => handleBlockFocus(block)}
          onReorderBlocks={(newBlocks) => setBlocks(newBlocks)}
        />
      </Flex>
    </Flex>
  );
};

export default Page;
