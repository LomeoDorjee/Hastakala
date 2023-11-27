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
import { DeleteIcon, EditIcon, EyeIcon, SearchIcon } from "../icons/icons";
import UserDepartForm from "../forms/UserDepartForm";



type STAFF = {
    STAFFID: number,
    STAFFNAME: string,
    STAFFCODE: string,
    DEPARTMENT: string,
    DESIGNATION: string,
    GENDER: string
}

type StaffProps = {
    staffs: STAFF[]
}


const columns = [
    // {name: "ID", uid: "id", sortable: true},
    { name: "CODE", uid: "STAFFCODE", sortable: true },
    { name: "NAME", uid: "STAFFNAME", sortable: true },
    { name: "DEPARTMENT", uid: "DEPARTMENT", sortable: true },
    { name: "DESIGNATION", uid: "DESIGNATION", sortable: true },
    { name: "ACTIONS", uid: "actions" },
];


export default function StaffTable({ staffs }: StaffProps) {

    const { isOpen, onClose, onOpen, onOpenChange } = useDisclosure()

    const [filterValue, setFilterValue] = useState("");
    const [rowsPerPage, setRowsPerPage] = useState(7);
    const [sortDescriptor, setSortDescriptor] = useState<SortDescriptor>({
        column: "STAFFCODE",
        direction: "ascending",
    });
    const [page, setPage] = useState(1);

    const pages = Math.ceil(((staffs?.length) ? staffs.length : 1) / rowsPerPage);

    const hasSearchFilter = Boolean(filterValue);

    const filteredItems = useMemo(() => {
        let filteredUsers = staffs;

        if (hasSearchFilter) {
            filteredUsers = filteredUsers?.filter((user) =>
                user.STAFFNAME.toLowerCase().includes(filterValue.toLowerCase()),
            );
        }

        return filteredUsers;
    }, [staffs, filterValue]);

    const items = useMemo(() => {
        const start = (page - 1) * rowsPerPage;
        const end = start + rowsPerPage;

        return (filteredItems) ? filteredItems?.slice(start, end) : [];
    }, [page, filteredItems, rowsPerPage]);

    const sortedItems = useMemo(() => {
        return [...items].sort((a: STAFF, b: STAFF) => {
            const first = a[sortDescriptor.column as keyof STAFF] as unknown as number;
            const second = b[sortDescriptor.column as keyof STAFF] as unknown as number;
            const cmp = first < second ? -1 : first > second ? 1 : 0;

            return sortDescriptor.direction === "descending" ? -cmp : cmp;
        });
    }, [sortDescriptor, items]);

    const handleUserEdit = (item: STAFF) => {
        // setToEditUserId(item.userid)
        // setToEditUserName(item.username)
        // onOpen()
    }

    const renderCell = useCallback((staff: STAFF, columnKey: Key) => {
        const cellValue = staff[columnKey as keyof STAFF];

        switch (columnKey) {
            case "STAFFNAME":
                return (
                    <User
                        // avatarProps={{ radius: "full", size: "sm", src: staff.image }}
                        classNames={{
                            description: "text-default-500",
                        }}
                        description={staff.GENDER}
                        name={staff.STAFFNAME}
                    />
                );
            // case "depname":
            //     return (
            //         <Chip color={(user.depname != "Unassigned") ? "success" : "warning"} variant="flat">{user.depname}</Chip>
            //     );
            case "actions":
                return (
                    <div className="relative flex items-center gap-3">
                        <Tooltip content="View Detail" color="success">
                            <span className="text-lg text-default-400 cursor-pointer active:opacity-50" onClick={() => handleUserEdit(staff)}>
                                <EyeIcon />
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
                        placeholder="Search by Staff Name..."
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
        staffs?.length,
        hasSearchFilter,
    ]);

    const bottomContent = useMemo(() => {
        return (
            <div className="py-2 px-2 flex justify-between items-center">
                <span className="text-default-400 text-small">Total {staffs?.length} Users</span>
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
                        <option value="7">7</option>
                        <option value="10">10</option>
                        <option value="15">15</option>
                    </select>
                </label>
            </div>
        );
    }, [items.length, page, pages, hasSearchFilter]);

    return (
        <>
            {/* <UserDepartForm
                departments={departments}
                ToEditUserId={ToEditUserId}
                ToEditUserName={ToEditUserName}
                onOpen={onOpen}
                isOpen={isOpen}
                onOpenChange={onOpenChange}
                onClose={onClose}
            /> */}
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
                        <TableRow key={item.STAFFID}>
                            {(columnKey) => <TableCell>{renderCell(item, columnKey)}</TableCell>}
                        </TableRow>
                    )}
                </TableBody>
            </Table>
        </>
    );
}
