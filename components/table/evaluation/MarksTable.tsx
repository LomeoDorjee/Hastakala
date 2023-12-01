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
    useDisclosure,
    Select,
    SelectItem,
    Spinner,
    Divider
} from "@nextui-org/react";
import { ChangeEvent, Key, useCallback, useEffect, useMemo, useState } from "react";
import { ChevronDownIcon, DeleteIcon, EditIcon, EyeIcon, SearchIcon } from "../../icons/icons";
import { getAllMarks } from "@/lib/actions/performance/evaluation.actions";
import StaffMarksForm from "../../forms/StaffMarksForm";

type MARKS = {
    MARKSID: number,
    STAFFID: number,
    STAFFNAME: string
    STAFFCODE: string
    FYEARID: number,
    FYEAR: string
    HOD_Q1: number,
    HOD_Q2: number,
    HOD_Q3: number,
    HOD_Q4: number,
    HOD_Q5: number,
    HOD_Q6: number,
    HOD_Q7: number,
    HOD_Q8: number,
    HOD_Q9: number,
    HOD_Q10: number,
    TOTAL_HOD: number,
    SUP_Q1: number,
    SUP_Q2: number,
    SUP_Q3: number,
    SUP_Q4: number,
    SUP_Q5: number,
    TOTAL_SUP: number,
}

type YEARS = {
    FYEARID: number
    FYEAR: string
}
type YearProps = {
    years: YEARS[]
}


const columns = [
    // {name: "ID", uid: "id", sortable: true},
    { name: "NAME", uid: "STAFFNAME", sortable: true },
    { name: "HOD TOTAL", uid: "TOTAL_HOD", sortable: true },
    { name: "SUPERVISOR TOTAL", uid: "TOTAL_SUP", sortable: true },
    { name: "ACTIONS", uid: "actions" },
];


export default function MarksTable({ years }: YearProps) {

    const { isOpen, onOpenChange, onClose, onOpen } = useDisclosure()

    const [marks, setMarks] = useState<MARKS[]>([])
    const [isLoading, setIsLoading] = useState(true);

    const [toEditStaffName, setToEditStaffName] = useState("");
    const [toEditStaffId, setToEditStaffId] = useState(0);

    const [selectedYear, setSelectedYear] = useState((years.length) ? "" + years[0].FYEARID : "1")

    const [hod_q1, sethod_q1] = useState(0);
    const [hod_q2, sethod_q2] = useState(0)
    const [hod_q3, sethod_q3] = useState(0)
    const [hod_q4, sethod_q4] = useState(0)
    const [hod_q5, sethod_q5] = useState(0)
    const [hod_q6, sethod_q6] = useState(0)
    const [hod_q7, sethod_q7] = useState(0)
    const [hod_q8, sethod_q8] = useState(0)
    const [hod_q9, sethod_q9] = useState(0)
    const [hod_q10, sethod_q10] = useState(0)
    const [sup_q1, setsup_q1] = useState(0)
    const [sup_q2, setsup_q2] = useState(0)
    const [sup_q3, setsup_q3] = useState(0)
    const [sup_q4, setsup_q4] = useState(0)
    const [sup_q5, setsup_q5] = useState(0)


    const fetchMarksData = async (yearid: number) => {
        let records = await getAllMarks(yearid)
        if (records == null) {
            records = await getAllMarks(yearid)
        }

        setIsLoading(false)
        console.log(records)
        if (records && records.error != "") {
            console.log(records.error)
            return;
        }
        if (records)
            setMarks(records.data)

        setPage(1)
    }

    useEffect(() => {
        fetchMarksData(selectedYear as unknown as number)
    }, [])

    const [filterValue, setFilterValue] = useState("");
    const [rowsPerPage, setRowsPerPage] = useState(7);
    const [sortDescriptor, setSortDescriptor] = useState<SortDescriptor>({
        column: "STAFFNAME",
        direction: "ascending",
    });
    const [page, setPage] = useState(1);

    // const pages = Math.ceil(((marks?.length) ? marks.length : 1) / rowsPerPage);

    const hasSearchFilter = Boolean(filterValue);

    const filteredItems = useMemo(() => {
        let filteredUsers = marks;

        if (hasSearchFilter) {
            filteredUsers = filteredUsers?.filter((user) =>
                user.STAFFNAME.toLowerCase().includes(filterValue.toLowerCase()),
            );
        }

        return filteredUsers;
    }, [marks, filterValue]);

    const pages = Math.ceil(filteredItems.length / rowsPerPage);

    const items = useMemo(() => {
        const start = (page - 1) * rowsPerPage;
        const end = start + rowsPerPage;

        return (filteredItems) ? filteredItems.slice(start, end) : [];
    }, [page, filteredItems, rowsPerPage]);

    const sortedItems = useMemo(() => {
        return [...items].sort((a: MARKS, b: MARKS) => {
            const first = a[sortDescriptor.column as keyof MARKS]
            const second = b[sortDescriptor.column as keyof MARKS]
            const cmp = first < second ? -1 : first > second ? 1 : 0;

            return sortDescriptor.direction === "descending" ? -cmp : cmp;
        });
    }, [sortDescriptor, items]);

    const handleMarksEdit = (item: MARKS) => {
        setToEditStaffId(item.STAFFID)
        setToEditStaffName(item.STAFFNAME)
        // setToEditUserName(item.username)
        sethod_q1(0)
        sethod_q2(0)
        sethod_q3(0)
        sethod_q4(0)
        sethod_q5(0)
        sethod_q6(0)
        sethod_q7(0)
        sethod_q8(0)
        sethod_q9(0)
        sethod_q10(0)
        setsup_q1(0)
        setsup_q2(0)
        setsup_q3(0)
        setsup_q4(0)
        setsup_q5(0)

        if (item.HOD_Q1)
            sethod_q1(item.HOD_Q1)
        if (item.HOD_Q2)
            sethod_q2(item.HOD_Q2)
        if (item.HOD_Q3)
            sethod_q3(item.HOD_Q3)
        if (item.HOD_Q4)
            sethod_q4(item.HOD_Q4)
        if (item.HOD_Q5)
            sethod_q5(item.HOD_Q5)
        if (item.HOD_Q6)
            sethod_q6(item.HOD_Q6)
        if (item.HOD_Q7)
            sethod_q7(item.HOD_Q7)
        if (item.HOD_Q8)
            sethod_q8(item.HOD_Q8)
        if (item.HOD_Q9)
            sethod_q9(item.HOD_Q9)
        if (item.HOD_Q10)
            sethod_q10(item.HOD_Q10)
        if (item.SUP_Q1)
            setsup_q1(item.SUP_Q1)
        if (item.SUP_Q2)
            setsup_q2(item.SUP_Q2)
        if (item.SUP_Q3)
            setsup_q3(item.SUP_Q3)
        if (item.SUP_Q4)
            setsup_q4(item.SUP_Q4)
        if (item.SUP_Q5)
            setsup_q5(item.SUP_Q5)

        onOpen()
    }

    const renderCell = useCallback((staff: MARKS, columnKey: Key) => {
        const cellValue = staff[columnKey as keyof MARKS];

        switch (columnKey) {
            case "STAFFNAME":
                return (
                    <User
                        // avatarProps={{ radius: "full", size: "sm", src: staff.image }}
                        classNames={{
                            description: "text-default-500",
                        }}
                        description={staff.STAFFCODE}
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
                        {/* <Tooltip content="View Detail" color="success">
                            <span className="text-lg text-default-400 cursor-pointer active:opacity-50">
                                <EyeIcon />
                            </span>
                        </Tooltip> */}
                        <Tooltip content="Edit Marks" color="secondary">
                            <span className="text-lg text-default-400 cursor-pointer active:opacity-50" onClick={() => handleMarksEdit(staff)}>
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

    const handleFyearChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
        if (e.target.value) {
            setIsLoading(true)
            fetchMarksData(e.target.value as unknown as number)
            setSelectedYear(e.target.value)
        }
    };

    const topContent = useMemo(() => {
        return (
            <div className="flex flex-row gap-4 justify-between items-end">
                <Input
                    isClearable
                    className="w-full"
                    placeholder="Search by Staff Name..."
                    startContent={<SearchIcon className="text-default-300" />}
                    value={filterValue}
                    onClear={() => setFilterValue("")}
                    onValueChange={onSearchChange}
                    size="sm"
                />
                <Select
                    label="Fiscal Year"
                    className="max-w-xs"
                    placeholder="Select Fiscal Year"
                    onChange={handleFyearChange}
                    defaultSelectedKeys={[selectedYear]}
                    size="sm"
                >
                    {years.map((year) => (
                        <SelectItem key={year.FYEARID} value={year.FYEAR}>
                            {year.FYEAR}
                        </SelectItem>
                    ))}
                </Select>
            </div>
        );
    }, [
        filterValue,
        onSearchChange,
        onRowsPerPageChange,
        sortedItems?.length,
        hasSearchFilter
    ]);

    const bottomContent = useMemo(() => {
        return (
            <div className="py-2 px-2 flex justify-between items-center">
                <span className="text-default-400 text-small">Total {marks?.length} Users</span>
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
                        <option value="7">7</option>
                        <option value="10">10</option>
                        <option value="15">15</option>
                    </select>
                </label>
            </div>
        );
    }, [page, pages, sortedItems.length]);

    return (
        <>
            <StaffMarksForm
                staffName={toEditStaffName}
                staffid={toEditStaffId}
                selectedYear={selectedYear}
                years={years}
                onOpen={onOpen}
                isOpen={isOpen}
                onOpenChange={onOpenChange}
                onClose={onClose}
                hod_q1={hod_q1}
                hod_q2={hod_q2}
                hod_q3={hod_q3}
                hod_q4={hod_q4}
                hod_q5={hod_q5}
                hod_q6={hod_q6}
                hod_q7={hod_q7}
                hod_q8={hod_q8}
                hod_q9={hod_q9}
                hod_q10={hod_q10}
                sup_q1={sup_q1}
                sup_q2={sup_q2}
                sup_q3={sup_q3}
                sup_q4={sup_q4}
                sup_q5={sup_q5}
            />
            <Table
                isCompact
                // removeWrapper
                aria-label="Example table with custom cells, pagination and sorting"
                bottomContent={bottomContent}
                bottomContentPlacement="outside"
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
                <TableBody
                    emptyContent={"No Data found"}
                    items={sortedItems}
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
