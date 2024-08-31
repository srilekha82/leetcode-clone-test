import React from 'react';
import Box from '@mui/material/Box';
import { MdFirstPage } from 'react-icons/md';
import IconButton from '@mui/material/IconButton';
import { MdKeyboardDoubleArrowLeft } from 'react-icons/md';
import { MdKeyboardDoubleArrowRight } from 'react-icons/md';
import { MdLastPage } from 'react-icons/md';
import { useTheme } from '@mui/material/styles';
import { TablePaginationActionsProps } from '@mui/material/TablePagination/TablePaginationActions';

const TablePaginationActions = (props: TablePaginationActionsProps) => {
  const theme = useTheme();
  const { count, page, rowsPerPage, onPageChange } = props;

  const handleFirstPageButtonClick = (event: React.MouseEvent<HTMLButtonElement, MouseEvent>) => {
    onPageChange(event, 0);
  };

  const handleBackButtonClick = (event: React.MouseEvent<HTMLButtonElement, MouseEvent>) => {
    onPageChange(event, page - 1);
  };

  const handleNextButtonClick = (event: React.MouseEvent<HTMLButtonElement, MouseEvent>) => {
    onPageChange(event, page + 1);
  };

  const handleLastPageButtonClick = (event: React.MouseEvent<HTMLButtonElement, MouseEvent>) => {
    onPageChange(event, Math.max(0, Math.ceil(count / rowsPerPage) - 1));
  };

  return (
    <Box sx={{ flexShrink: 0, ml: 2.5 }}>
      <IconButton onClick={handleFirstPageButtonClick} disabled={page === 0} aria-label='first page'>
        {theme.direction === 'rtl' ? <MdLastPage /> : <MdFirstPage />}
      </IconButton>
      <IconButton onClick={handleBackButtonClick} disabled={page === 0} aria-label='previous page'>
        {theme.direction === 'rtl' ? <MdKeyboardDoubleArrowRight /> : <MdKeyboardDoubleArrowLeft />}
      </IconButton>
      <IconButton
        onClick={handleNextButtonClick}
        disabled={page >= Math.ceil(count / rowsPerPage) - 1}
        aria-label='next page'
      >
        {theme.direction === 'rtl' ? <MdKeyboardDoubleArrowLeft /> : <MdKeyboardDoubleArrowRight />}
      </IconButton>
      <IconButton
        onClick={handleLastPageButtonClick}
        disabled={page >= Math.ceil(count / rowsPerPage) - 1}
        aria-label='last page'
      >
        {theme.direction === 'rtl' ? <MdFirstPage /> : <MdLastPage />}
      </IconButton>
    </Box>
  );
};

export default TablePaginationActions;
