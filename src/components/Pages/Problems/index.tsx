import { useQuery } from '@tanstack/react-query';
import getProblems from '../../../services/getProblems';
import Backdrop from '@mui/material/Backdrop';
import CircularProgress from '@mui/material/CircularProgress';
import { useMemo, useState } from 'react';
import { Problem } from '../../../utils/types';
import {
  createColumnHelper,
  useReactTable,
  getCoreRowModel,
  getFilteredRowModel,
  getPaginationRowModel,
  ColumnFiltersState,
} from '@tanstack/react-table';
import ProblemsTable from './ProblemsTable';
import { Link } from 'react-router-dom';
import { difficultyColors } from '../../../constants/Index';
import { isAccepted, isRejected } from '../../../utils/helpers';
import PendingOutlinedIcon from '@mui/icons-material/PendingOutlined';
import { useUserSlice } from '../../../store/user';
import TaskAltOutlinedIcon from '@mui/icons-material/TaskAltOutlined';
import { SelectChangeEvent } from '@mui/material';

export default function ProblemsSet() {
  const [open, setOpen] = useState<boolean>(true);
  const [difficultyFilter, setDifficultyFilter] = useState<string>('all');
  const [statusFilter, setStatusFilter] = useState<string>('all');

  const handleClose = () => {
    setOpen(false);
  };
  const columnHelper = createColumnHelper<Problem>();
  const [columnFilters, setColumnFilters] = useState<ColumnFiltersState>([]);
  const { data, isLoading, isError, error } = useQuery({
    queryKey: ['problems'],
    queryFn: getProblems,
  });

  const user = useUserSlice((state) => state.user);

  const columns = useMemo(
    () => [
      columnHelper.accessor((row) => row.status, {
        id: 'status',
        cell: (info) => {
          let icon;
          if (user) {
            icon = isAccepted(info.row.original._id, user?.submissions) ? (
              <TaskAltOutlinedIcon color='success' />
            ) : isRejected(info.row.original._id, user?.submissions) ? (
              <PendingOutlinedIcon color='warning' />
            ) : null;
          } else {
            icon = null;
          }
          return <div> {icon}</div>;
        },
        filterFn: 'statusFilter' as any,
      }),
      columnHelper.accessor((row) => row.title, {
        id: 'Title',
        cell: (info) => {
          return (
            <Link to={`/problems/${info.row.original._id}${info.row.index + 1}`}>
              {info.row.index + 1}. {info.getValue()}
            </Link>
          );
        },
      }),
      columnHelper.accessor((row) => row.difficulty, {
        id: 'difficulty',
        cell: (info) => {
          return <div style={{ color: difficultyColors[info.getValue()] }}>{info.getValue()}</div>;
        },
        filterFn: 'difficultyFilter' as any,
      }),
    ],
    [user]
  );

  const table = useReactTable({
    data: data?.data ?? [],
    columns,
    getCoreRowModel: getCoreRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    onColumnFiltersChange: setColumnFilters,
    globalFilterFn: 'includesStringSensitive',
    state: {
      columnFilters,
    },
    filterFns: {
      difficultyFilter: (row, columnId, filterValue) => {
        if (filterValue === 'all') {
          return row;
        }
        const value = filterValue ? row.original[columnId] === filterValue : row.original[columnId];
        return value;
      },
      statusFilter: (row, _columnId, filterValue) => {
        console.log(row.original._id, filterValue);
        const acceptedProblems = [
          ...new Set(user?.submissions.filter((s) => s.status === 'Accepted').map((s) => s.problemId)),
        ];
        const rejectedProblems = [
          ...new Set(user?.submissions.filter((s) => s.status === 'Wrong Answer').map((s) => s.problemId)),
        ];
        const onlyRejectProblems = rejectedProblems.filter((id) => !acceptedProblems.includes(id));
        if (filterValue === 'solved') {
          return acceptedProblems?.includes(row.original._id);
        } else if (filterValue === 'attempted') {
          return onlyRejectProblems?.includes(row.original._id);
        } else if (filterValue === 'todo') {
          return !onlyRejectProblems?.includes(row.original._id) && !acceptedProblems.includes(row.original._id);
        }
        return true;
      },
    },
  });
  const handleDifficultyChange = (event: SelectChangeEvent) => {
    setDifficultyFilter(event.target.value);
    table.getColumn('difficulty')?.setFilterValue(event.target.value);
  };
  const handleStatusChange = (event: SelectChangeEvent) => {
    setStatusFilter(event.target.value);
    table.getColumn('status')?.setFilterValue(event.target.value);
  };
  if (isLoading) {
    return (
      <>
        <Backdrop sx={{ color: '#fff', zIndex: (theme) => theme.zIndex.drawer + 1 }} open={open} onClick={handleClose}>
          <CircularProgress color='inherit' />
        </Backdrop>
      </>
    );
  }

  if (isError) {
    return <p>{error.message}</p>;
  }

  return (
    <>
      <ProblemsTable
        handleStatusChange={handleStatusChange}
        difficultyFilter={difficultyFilter}
        statusFilter={statusFilter}
        handleDifficultChange={handleDifficultyChange}
        table={table}
        data={data?.data as Problem[]}
      />
    </>
  );
}
