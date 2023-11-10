"use client"
import {
  Table,
  TableHeader,
  TableColumn,
  TableBody,
  TableRow,
  TableCell,
  Input,
  Button,
  DropdownTrigger,
  Dropdown,
  DropdownMenu,
  DropdownItem,
  Chip,
  User,
  Pagination,
  Selection,
  ChipProps,
  SortDescriptor,
  Tooltip,
  useDisclosure
} from "@nextui-org/react";
import { ChangeEvent, Key, useCallback, useMemo, useState } from "react";
import { DeleteIcon, EditIcon, SearchIcon } from "../icons/icons";
import UserDepartForm from "../forms/UserDepartForm";

type UserProps = {
  users: {
    userid: string
    username: string
    depname: string | null
    fullname: string
    image: string
  }[] | undefined;
  departments: {
    depid: number
    depname: string 
  }[] | undefined
}

type User = {
  userid: string
  username: string
  depname: string | null
  fullname: string
  image: string
}

const columns = [
  // {name: "ID", uid: "id", sortable: true},
  {name: "NAME", uid: "name", sortable: true},
  {name: "DEPARTMENT", uid: "depname", sortable: true},
  {name: "ACTIONS", uid: "actions"},
];


export default function UserTable({ users, departments }: UserProps) {

  const { isOpen, onClose, onOpen, onOpenChange } = useDisclosure()

  const [ToEditUserId, setToEditUserId] = useState("");
  const [ToEditUserName, setToEditUserName] = useState("");

  const [filterValue, setFilterValue] = useState("");
  const [rowsPerPage, setRowsPerPage] = useState(5);
  const [sortDescriptor, setSortDescriptor] = useState<SortDescriptor>({
    column: "id",
    direction: "ascending",
  });
  const [page, setPage] = useState(1);

  const pages = Math.ceil(((users?.length)?users.length:1) / rowsPerPage);

  const hasSearchFilter = Boolean(filterValue);

  const filteredItems = useMemo(() => {
    let filteredUsers = users;

    if (hasSearchFilter) {
      filteredUsers = filteredUsers?.filter((user) =>
        user.username.toLowerCase().includes(filterValue.toLowerCase()),
      );
    }

    return filteredUsers;
  }, [users, filterValue]);

  const items = useMemo(() => {
    const start = (page - 1) * rowsPerPage;
    const end = start + rowsPerPage;

    return (filteredItems)?filteredItems?.slice(start, end):[];
  }, [page, filteredItems, rowsPerPage]);

  const sortedItems = useMemo(() => {
    return [...items].sort((a: User, b: User) => {
      const first = a[sortDescriptor.column as keyof User] as unknown as number;
      const second = b[sortDescriptor.column as keyof User] as unknown as number;
      const cmp = first < second ? -1 : first > second ? 1 : 0;

      return sortDescriptor.direction === "descending" ? -cmp : cmp;
    });
  }, [sortDescriptor, items]);

  const handleUserEdit = (item: User) => {
    setToEditUserId(item.userid)
    setToEditUserName(item.username)
    onOpen()
  }

  const renderCell = useCallback((user: User, columnKey: Key) => {
    const cellValue = user[columnKey as keyof User];

    switch (columnKey) {
      case "name":
        return (
          <User
            avatarProps={{radius: "full", size: "sm", src: user.image}}
            classNames={{
              description: "text-default-500",
            }}
            description={user.fullname}
            name={user.username}
          />
        );
      case "depname":
        return (
          <Chip color={(user.depname != "Unassigned") ? "success": "warning"} variant="flat">{user.depname}</Chip>
        );
      case "role":
        return (
          <div className="flex flex-col">
            <p className="text-bold text-small capitalize">{cellValue}</p>
            {/* <p className="text-bold text-tiny capitalize text-default-500">{user.team}</p> */}
          </div>
        );
      case "actions":
        return (
          <div className="relative flex items-center gap-3">
            <Tooltip content="Edit User" color="secondary">
                <span className="text-lg text-default-400 cursor-pointer active:opacity-50" onClick={ () => handleUserEdit(user) }>
                    <EditIcon />
                </span>
                </Tooltip>
                <Tooltip color="danger" content="Delete User">
                    <span className="text-lg text-danger cursor-pointer active:opacity-50">
                    <DeleteIcon />
                </span>
            </Tooltip>
          </div>
        );
      default:
        return cellValue;
    }
  }, []);
  

  const onRowsPerPageChange = useCallback((e: ChangeEvent<HTMLSelectElement>) => {
    setRowsPerPage(Number(e.target.value));
    setPage(1);
  }, []);

  const onSearchChange = useCallback((value?: string) => {
    if (value) {
      setFilterValue(value);
      setPage(1);
    } else {
      setFilterValue("");
    }
  }, []);

  const topContent = useMemo(() => {
    return (
      <div className="flex flex-col gap-4">
        <div className="flex justify-between gap-3 items-end">
          <Input
            isClearable
            className="w-full"
            placeholder="Search by name..."
            startContent={<SearchIcon className="text-default-300" />}
            value={filterValue}
            variant="bordered"
            onClear={() => setFilterValue("")}
            onValueChange={onSearchChange}
          />
        </div>
      </div>
    );
  }, [
    filterValue,
    onSearchChange,
    onRowsPerPageChange,
    users?.length,
    hasSearchFilter,
  ]);

  const bottomContent = useMemo(() => {
    return (
      <div className="py-2 px-2 flex justify-between items-center">
          <span className="text-default-400 text-small">Total {users?.length} Users</span>
          <Pagination
            showControls
            classNames={{
              cursor: "bg-foreground text-background",
            }}
            color="default"
            isDisabled={hasSearchFilter}
            page={page}
            total={pages}
            variant="light"
            onChange={setPage}
          />
          <label className="flex items-center text-default-400 text-small">
            Rows per page:
            <select
              className="bg-transparent outline-none text-default-400 text-small"
              onChange={onRowsPerPageChange}
            >
              <option value="5">5</option>
              <option value="10">10</option>
              <option value="15">15</option>
            </select>
          </label>
      </div>
    );
  }, [ items.length, page, pages, hasSearchFilter]);

  return (
    <>
      <UserDepartForm
        departments={departments}
        ToEditUserId={ToEditUserId}
        ToEditUserName={ToEditUserName}
        onOpen = {onOpen } 
        isOpen = { isOpen } 
        onOpenChange = { onOpenChange } 
        onClose = { onClose }
      />
      <Table
        isCompact
        // removeWrapper
        aria-label="Example table with custom cells, pagination and sorting"
        bottomContent={bottomContent}
        bottomContentPlacement="outside"
        checkboxesProps={{
          classNames: {
            wrapper: "after:bg-foreground after:text-background text-background",
          },
        }}
        // classNames={classNames}
        selectionMode="single"
        color="primary"
        sortDescriptor={sortDescriptor}
        topContent={topContent}
        topContentPlacement="outside"
        onSortChange={setSortDescriptor}
      >
        <TableHeader columns={columns}>
          {(column) => (
            <TableColumn
              key={column.uid}
              align={column.uid === "actions" ? "center" : "start"}
              allowsSorting={column.sortable}
            >
              {column.name}
            </TableColumn>
          )}
        </TableHeader>
        <TableBody emptyContent={"No users found"} items={sortedItems}>
          {(item) => (
            <TableRow key={item.userid}>
              {(columnKey) => <TableCell>{renderCell(item, columnKey)}</TableCell>}
            </TableRow>
          )}
        </TableBody>
      </Table>
    </>
  );
}
