"use client";

import { Shell } from "../shell";
import { Card, CardContent, CardFooter, CardHeader } from "../ui/card";
import { BackButton } from "./back-buton";
import { Header } from "./header";
import { Social } from "./social";

interface CardWrapperProps {
    children: React.ReactNode;
    headerLaberl: string;
    backButtonLabel: string;
    backButtonHref: string;
    showSocial?: boolean;
}

export const CardWrapper = ({
    children,
    headerLaberl,
    backButtonLabel,
    backButtonHref,
    showSocial,
}: CardWrapperProps) => {
    return (
        <Shell className="max-w-lg">
            <Card className="w-[450px] shadow-md">
                <CardHeader>
                    <Header label={headerLaberl} />
                </CardHeader>
                <CardContent>{children}</CardContent>
                {showSocial && (
                    <CardFooter className="grid gap-4">
                        <div className="relative">
                            <div className="absolute inset-0 flex items-center">
                                <span className="w-full border-t" />
                            </div>
                            <div className="relative flex justify-center text-xs uppercase">
                                <span className="bg-background px-2 text-muted-foreground">
                                    Or continue with
                                </span>
                            </div>
                        </div>
                        <Social />
                    </CardFooter>
                )}
                <CardFooter>
                    <BackButton label={backButtonLabel} href={backButtonHref} />
                </CardFooter>
            </Card>
        </Shell>
    );
};
