"use client"
import React, { ChangeEvent, Key, useCallback, useEffect, useMemo, useState } from "react";
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
    Spinner,
    Select,
    SelectItem,
    Tooltip,
    useDisclosure
} from "@nextui-org/react";
import { EditIcon, SearchIcon } from "../../icons/icons";
import { getEducationRecord, populateEducationData } from "@/lib/actions/performance/evaluation.actions";
import EducationForm from "@/components/forms/EducationForm";
import { sessionUser } from "@/lib/actions/config/user.actions";
import toast from "react-hot-toast";

type YEAR = {
    FYEARID: number
    FYEAR: string
}
type Props = {
    years: YEAR[]
    sessionUser: sessionUser
}

type RECORD = {
    STAFFID: number,
    STAFFNAME: string
    STAFFCODE: string
    DEPARTMENT: string
    DESIGNATION: string
    FYEARID: number
    QUALIFICATION: string
    FYEAR: string
}

const columns = [
    { name: "NAME", uid: "STAFFNAME", sortable: true },
    { name: "DEPARTMENT", uid: "DEPARTMENT", sortable: true },
    { name: "DESIGNATION", uid: "DESIGNATION", sortable: true },
    { name: "YEAR", uid: "FYEAR", sortable: true },
    { name: "QUALIFICATION", uid: "QUALIFICATION", sortable: true },
    { name: "ACTIONS", uid: "actions" },
];
export default function EducationTable({ years, sessionUser }: Props) {

    const { isOpen, onOpen, onOpenChange, onClose } = useDisclosure();

    const [staffname, setstaffname] = useState("")
    const [staffid, setstaffid] = useState(0)

    const [Data, setData] = useState<RECORD[]>([])
    const [isLoading, setIsLoading] = useState(true);

    const [toSelectFyearid, setToSelectFyearid] = useState((years.length) ? "" + years[1].FYEARID : "1")

    let yearID = toSelectFyearid
    const [isPopulate, setIsPopulate] = useState(false)

    const fetchData = async (fyearid: number) => {
        let records = await getEducationRecord(fyearid, sessionUser)

        setIsLoading(false)
        if (records && records.error != "") {
            console.log(records.error)
            return;
        }
        if (records)
            setData(records.data)
    }

    useEffect(() => {
        fetchData(toSelectFyearid as unknown as number)
    }, [])

    const [filterValue, setFilterValue] = useState("");
    const [rowsPerPage, setRowsPerPage] = useState(5);
    const [sortDescriptor, setSortDescriptor] = useState<SortDescriptor>({
        column: "STAFFNAME",
        direction: "ascending",
    });

    const [page, setPage] = useState(1);

    const hasSearchFilter = Boolean(filterValue);

    const filteredItems = useMemo(() => {
        let filteredData = Data;

        if (hasSearchFilter) {
            filteredData = filteredData.filter((data) =>
                data.STAFFNAME.toLowerCase().includes(filterValue.toLowerCase()),
            );
        }

        return filteredData;
    }, [Data, filterValue]);

    const pages = Math.ceil(filteredItems.length / rowsPerPage);

    const sortedItems = useMemo(() => {
        return [...filteredItems].sort((a: RECORD, b: RECORD) => {
            const first = a[sortDescriptor.column as keyof RECORD] as number;
            const second = b[sortDescriptor.column as keyof RECORD] as number;
            const cmp = first < second ? -1 : first > second ? 1 : 0;

            return sortDescriptor.direction === "descending" ? -cmp : cmp;
        });
    }, [sortDescriptor, filteredItems]);

    const items = useMemo(() => {
        const start = (page - 1) * rowsPerPage;
        const end = start + rowsPerPage;

        return sortedItems.slice(start, end);
    }, [page, sortedItems, rowsPerPage]);

    const handleEdit = (item: RECORD) => {
        if (item.FYEARID > 0) {
            setToSelectFyearid(item.FYEARID as unknown as string)
        }
        setstaffid(item.STAFFID)
        setstaffname(item.STAFFNAME)
        onOpen()
    }

    const renderCell = useCallback((data: RECORD, columnKey: Key) => {
        const cellValue = data[columnKey as keyof RECORD];

        switch (columnKey) {
            case "STAFFNAME":
                return (
                    <User
                        description={data.STAFFCODE}
                        name={data.STAFFNAME}
                    />
                );
            case "actions":
                return (
                    <div className="flex justify-center items-center gap-2">
                        <Tooltip content="Edit Education" color="secondary">
                            <span className="text-lg text-default-400 cursor-pointer active:opacity-50" onClick={() => handleEdit(data)}>
                                <EditIcon />
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

    const onClear = useCallback(() => {
        setFilterValue("")
        setPage(1)
    }, [])

    const handleFyearChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
        if (e.target.value) {
            setIsLoading(true)
            yearID = e.target.value
            fetchData(e.target.value as unknown as number)
        }
    };

    const populateData = async () => {

        setIsPopulate(true)

        const response = await populateEducationData(yearID as unknown as number)

        setIsPopulate(false)

        if (response?.status !== "success") {
            toast.error(response.message)
        } else if (response) {
            toast.success(response.message)
            fetchData(yearID as unknown as number)
        }

    }

    const topContent = useMemo(() => {
        return (
            <div className="flex flex-row gap-3 justify-between items-center">
                <Input
                    isClearable
                    className="w-full"
                    placeholder="Search by Staff Name..."
                    startContent={<SearchIcon />}
                    value={filterValue}
                    onClear={() => onClear()}
                    onValueChange={onSearchChange}
                    size="sm"
                />
                <Select
                    label="Fiscal Year"
                    className="max-w-xs"
                    placeholder="Select Fiscal Year"
                    onChange={handleFyearChange}
                    defaultSelectedKeys={[toSelectFyearid]}
                    size="sm"
                >
                    {years.map((year) => (
                        <SelectItem key={year.FYEARID} value={year.FYEAR}>
                            {year.FYEAR}
                        </SelectItem>
                    ))}
                </Select>
                <Tooltip color="warning" content="Same as Previous Years">
                    <Button
                        color="warning"
                        onClick={populateData}
                        size="md"
                        className="rounded-lg"
                    >
                        {(isPopulate) ? <Spinner /> : "Populate"}
                    </Button>
                </Tooltip>
            </div>
        );
    }, [
        filterValue,
        onSearchChange,
        onRowsPerPageChange,
        Data.length,
        hasSearchFilter,
        isPopulate,
    ]);

    const bottomContent = useMemo(() => {
        return (
            <div className="py-2 px-2 flex justify-between items-center">
                <span className="text-default-400 text-small">Total {Data?.length} Users</span>

                {pages > 0 ? (
                    <Pagination
                        showControls
                        classNames={{
                            cursor: "bg-foreground text-background",
                        }}
                        color="secondary"
                        isDisabled={hasSearchFilter}
                        page={page}
                        total={pages}
                        variant="light"
                        onChange={setPage}
                    />
                ) : null
                }
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
    }, [items.length, page, pages, hasSearchFilter]);

    return (
        <>
            <EducationForm
                onOpen={onOpen}
                isOpen={isOpen}
                onOpenChange={onOpenChange}
                onClose={onClose}
                staffid={staffid}
                staffname={staffname}
                toSelectFyearid={toSelectFyearid}
                fetchData={fetchData}
                years={years}
            />
            <Table
                aria-label="Education Table"
                isHeaderSticky
                bottomContent={bottomContent}
                bottomContentPlacement="outside"
                selectionMode="single"
                color="success"
                sortDescriptor={sortDescriptor}
                topContent={topContent}
                topContentPlacement="inside"
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
                <TableBody
                    emptyContent={"No Data found"}
                    items={items}
                    isLoading={isLoading}
                    loadingContent={<Spinner color="secondary" />}
                >
                    {(item) => (
                        <TableRow key={item.STAFFCODE}>
                            {(columnKey) => <TableCell>{renderCell(item, columnKey)}</TableCell>}
                        </TableRow>
                    )}
                </TableBody>
            </Table>
        </>
    );
}