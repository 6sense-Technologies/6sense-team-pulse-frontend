export type TFooterText = 
{
    heading: string;
    subHeading: string;
}

export type OrDividerProps =
{
    text: string;
    className?: string;
}

export type TBasicSignInFormInputs = 
{
    emailAddress: string;
    password: string;
}

export type TBasicSignupFormInputs = 
{
    displayName: string;
    emailAddress: string;
    password: string;
}

export type TVerifyEmail = 
{
    otp: string;
    email: string;
}

export type TOrgazinationDetails = 
{
    organizationName: string;
    domainName: string;
}