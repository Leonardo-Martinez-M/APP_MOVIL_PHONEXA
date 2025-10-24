import React from 'react';

interface IconRendererProps {
    iconSvgXml: string;
}

const IconRenderer = ({ iconSvgXml }: IconRendererProps) => (
    <div
        className="w-6 h-6 mr-[16px] text-white flex-shrink-0"
        dangerouslySetInnerHTML={{ __html: iconSvgXml }}
    />
);

interface ButtonMenuProps {
    iconSvgXml: string;
    text: string;
    onPress: () => void;
    disabled?: boolean;
}
const ButtonMenu = ({ iconSvgXml, text, onPress, disabled = false }: ButtonMenuProps) => {

    const baseClasses = `flex items-center justify-center w-[240px] h-[56px] 
    bg-[#00BF63] rounded-[16px] border border-[#058252] border-opacity-30 
    shadow-[0px_2px_8px_0px_rgba(0,0,0,0.16)] 
    py-[17px] px-[27px] transition-transform duration-100 ease-out`;

    const hoverClasses = disabled ? '' : 'hover:bg-[#00A354] active:translate-y-0.5 active:shadow-none';
    const disabledClasses = disabled ? 'opacity-60 cursor-not-allowed' : '';

    return (
        <button
            className={`${baseClasses} ${hoverClasses} ${disabledClasses}`}
            onClick={!disabled ? onPress : undefined}
            disabled={disabled}
        >
            {iconSvgXml && (
                <IconRenderer iconSvgXml={iconSvgXml} />
            )}

            <span
                className="text-white text-[18px] font-bold uppercase select-none"
            >
                {text}
            </span>
        </button>
    );
};

export default ButtonMenu;

