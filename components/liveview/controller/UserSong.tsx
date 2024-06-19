"use client";

import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectGroup, SelectItem, SelectLabel, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Play } from "lucide-react";
import { useState } from "react";

export type User = {
    id: string, name: string, songs: {
        title: string,
        fileId: string,
        start: number,
        end: number
    }[]
};

export function SelectUserSong({ users, currentUser, handleSelect }: { users: User[], currentUser?: User, handleSelect: (user: User) => void }) {
    let [selectedUser, setSelectedUser] = useState<User | null>(null);


    function handleClick() {
        if (!selectedUser) return;

        handleSelect(selectedUser);
    }

    return (
        <div className="flex flex-row gap-1 mb-1">
            <Select defaultValue={currentUser?.name} onValueChange={(name) => setSelectedUser(users.find((user) => user.name == name) ?? null)
            }>
                <SelectTrigger className="w-[180px]">
                    <SelectValue placeholder="Wähle einen Schüler" />
                </SelectTrigger>
                <SelectContent>
                    <SelectGroup>
                        <SelectLabel>Schüler</SelectLabel>
                        {users.map((user) => (
                            <SelectItem key={user.id} value={user.name}>
                                {user.name}
                            </SelectItem>
                        ))}
                    </SelectGroup>
                </SelectContent>
            </Select>
            <Button onClick={handleClick} className="outline">
                <Play className="h-4 w-4" />
            </Button>
        </div>

    )
}