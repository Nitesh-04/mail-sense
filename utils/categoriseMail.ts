import { Category } from '@prisma/client';

export function categoriseMail(sender: string): Category {
    
    if (
        sender.includes("Dean Academics") || sender.includes("Dean SENSE")
    ) {
        return Category.Academics;
    }

    
    if (
        sender.includes("Helpdesk CDC")
    ) {
        return Category.Cdc;
    }

    
    if (
        sender.includes("Director Student Welfare") || sender.includes("Convenor Riviera")
    ) {
        return Category.Events;
    }

    
    if (
        sender.includes("Chief Warden Mens Hostel") || sender.includes("Hostel")
    ) {
        return Category.Hostel;
    }

    
    return Category.Misc;
}
