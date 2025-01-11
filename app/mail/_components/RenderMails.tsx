import { Email } from "@/lib/types";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

interface RenderMailsProps {
  emailCategories: {
    academic: Email[];
    cdc: Email[];
    events: Email[];
    hostel: Email[];
    misc: Email[];
  };
}

export default function RenderMails({ emailCategories }: RenderMailsProps) {
  const formatDate = (date: Date) => {
    return new Date(date).toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  const categories = [
    { id: "academic", label: "Academics", emails: emailCategories.academic },
    { id: "cdc", label: "CDC", emails: emailCategories.cdc },
    { id: "events", label: "Events", emails: emailCategories.events },
    { id: "hostel", label: "Hostel", emails: emailCategories.hostel },
    { id: "misc", label: "Misc", emails: emailCategories.misc },
  ];

  return (
    <Tabs defaultValue="academic" className="w-full">
      <TabsList className="grid w-full grid-cols-5">
        {categories.map((category) => (
          <TabsTrigger key={category.id} value={category.id}>
            {category.label}
          </TabsTrigger>
        ))}
      </TabsList>

      {categories.map((category) => (
        <TabsContent key={category.id} value={category.id}>
          <div className="space-y-4">
            {category.emails.map((email) => (
              <div
                key={email.id}
                className="bg-white rounded-lg shadow-md p-6 hover:shadow-lg transition-shadow duration-200"
              >
                <div className="flex justify-between items-start mb-3">
                  <h2 className="text-xl font-semibold text-gray-800">
                    {email.subject}
                  </h2>
                  <span className="text-sm text-gray-500">
                    {formatDate(email.receivedAt)}
                  </span>
                </div>

                <p className="text-gray-600 mb-2">
                  <span className="font-medium">From:</span> {email.sender}
                </p>

                <div className="mt-4 text-gray-700">
                  <p className="line-clamp-3">{email.summary}</p>
                </div>
              </div>
            ))}
            {category.emails.length === 0 && (
              <div className="text-center py-8 bg-gray-50 rounded-lg">
                <p className="text-gray-600">No emails in this category</p>
              </div>
            )}
          </div>
        </TabsContent>
      ))}
    </Tabs>
  );
}