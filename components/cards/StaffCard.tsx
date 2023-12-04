"use client"
import { Switch, Select, SelectItem, Card, CardHeader, CardBody, Divider, User, Avatar, RadioGroup, Radio } from "@nextui-org/react"
import toast from "react-hot-toast"
import { mapUserToStaff, mapUserType, sessionUser } from "@/lib/actions/config/user.actions"
import { useState } from "react"
import { updateSupportStaff } from "@/lib/actions/pis/staffs.actions"

type Props = {
    staff: {
        STAFFID: number
        STAFFNAME: string
        STAFFCODE: string
        DEPARTMENT: string
        DESIGNATION: string
        GENDER: string
        ISSUPPORT: boolean
    }
    users: {
        userid: string
        username: string
        depname: string | null
        fullname: string
        image: string
    }[]
    userdetail: sessionUser
}

export default function StaffCard({
    staff,
    users,
    userdetail
}: Props) {

    const [userType, setUserType] = useState((userdetail?.usertype) ? userdetail.usertype : "REGULAR");
    const [isSupport, setIsSupport] = useState((staff.ISSUPPORT) ? staff.ISSUPPORT : false);

    const handleUserMap = async (toMapUserId: string) => {
        const response = await mapUserToStaff(toMapUserId, staff.STAFFID)
        toast.success(response.status)
    }

    const handleUserType = async (usertype: string) => {
        const response = await mapUserType(usertype, staff.STAFFID)
        toast.success(response.status)
    }

    const handleSupportStaff = async () => {
        let support = true
        if (isSupport) support = false
        const response = await updateSupportStaff(support, staff.STAFFID)
        toast.success(response.status)
    }

    return (
        <>
            <Card className="max-w-xl mx-auto">
                <CardHeader>
                    <div className="flex gap-1">
                        <Avatar
                            src={(staff.GENDER == "Male") ? '/assets/svg/male.svg' : '/assets/svg/female.svg'}
                            className="w-20 h-20 text-large" />
                        <Divider orientation="vertical" />

                        <div className="flex flex-col justify-end items-start">
                            <h3 className="font-bold text-lg">{staff.STAFFNAME}</h3>
                            <div className="flex flex-wrap justify-start items-start">
                                <p className="font-semibold text-sm pr-2">{staff.DEPARTMENT}</p>
                                <Divider orientation="vertical" />
                                <p className="font-semibold text-sm pl-2">{staff.DESIGNATION}</p>
                            </div>
                        </div>
                    </div>

                </CardHeader>
                <Divider />
                <CardBody>

                    <div className="flex flex-col flex-wrap gap-5 py-2">
                        {
                            (userdetail) ? (
                                <>
                                    <Select
                                        autoFocus
                                        items={users}
                                        label="Mapped To"
                                        placeholder="Select a User"
                                        defaultSelectedKeys={[(userdetail?.userid) ? userdetail.userid : ""]}
                                        onChange={(e) => handleUserMap(e.target.value)}
                                    >
                                        {(user) => <SelectItem key={user.userid} textValue={user.fullname}>
                                            <User
                                                description={user.depname}
                                                name={user.fullname}
                                            />
                                        </SelectItem>}
                                    </Select>

                                    <RadioGroup
                                        label="Staff Type"
                                        value={userType}
                                        onValueChange={setUserType}
                                        onChange={(e) => handleUserType(e.target.value)}
                                        orientation="horizontal"
                                        className="p-2 bg-gray-100 rounded-lg"
                                        color="secondary"
                                    >
                                        <Radio value="REGULAR">Regular</Radio>
                                        <Radio value="HOD">Department Head</Radio>
                                        <Radio value="SUPERVISOR">Supervisor</Radio>
                                        <Radio value="MANAGEMENT">Management</Radio>
                                    </RadioGroup>
                                </>
                            ) : (<></>)
                        }


                        <Switch
                            isSelected={isSupport}
                            onValueChange={setIsSupport}
                            color="success"
                            onChange={handleSupportStaff}
                        >
                            Is Support Staff ?
                        </Switch>

                    </div>
                </CardBody>
            </Card>
        </>
    );
}
