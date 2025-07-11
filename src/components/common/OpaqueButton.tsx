import { Button, ButtonProps, PaletteColor } from '@mui/material';

export interface OpaqueButtonProps extends ButtonProps {
  palette: PaletteColor;
  passedRef?: any;
}

export const OpaqueButton: React.FC<OpaqueButtonProps> = ({
  children,
  palette,
  sx,
  passedRef,
  ...props
}) => {
  return (
    <Button
      ref={passedRef}
      variant="contained"
      sx={{
        background: palette.opaque,
        color: palette.main,
        '&:hover': { background: palette.opaque, color: '#FFFFFF' },
        ...sx,
      }}
      {...props}
    >
      {children}
    </Button>
  );
};
