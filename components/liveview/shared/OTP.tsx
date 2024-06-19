"use client";
import {
    InputOTP,
    InputOTPGroup,
    InputOTPSeparator,
    InputOTPSlot,
} from "@/components/ui/input-otp"
import { REGEXP_ONLY_DIGITS_AND_CHARS } from "input-otp"

export function OTPInput({ value, onChange = (v) => null, disabled }: { value: string, onChange?: (value: string) => void, disabled?: boolean }) {
    return (
        <InputOTP
            value={value}
            onChange={onChange}
            maxLength={6}
            pattern={"[0-9]*"}
            disabled={disabled}
        >
            <InputOTPGroup>
                <InputOTPSlot index={0} />
                <InputOTPSlot index={1} />
                <InputOTPSlot index={2} />
            </InputOTPGroup>
            <InputOTPSeparator />
            <InputOTPGroup>
                <InputOTPSlot index={3} />
                <InputOTPSlot index={4} />
                <InputOTPSlot index={5} />
            </InputOTPGroup>
        </InputOTP>

    );
}