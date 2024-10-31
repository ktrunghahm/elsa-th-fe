import { Link, Typography } from '@mui/material';
import { useConfirm } from 'material-ui-confirm';
import { ReactNode } from 'react';
import { Link as RouterLink, useNavigate } from 'react-router-dom';

export function RouterLinkWithConfirm({
  to,
  confirmTitle,
  confirmDescription,
  action,
  requiresConfirm,
  children,
}: {
  to: string;
  confirmTitle: string;
  confirmDescription: string;
  requiresConfirm: boolean;
  children: ReactNode;
  action?: () => Promise<void>;
}) {
  const confirm = useConfirm();
  const navigate = useNavigate();

  return (
    <Link
      to={to}
      component={RouterLink}
      onClick={
        requiresConfirm
          ? async (e) => {
              e.preventDefault();
              try {
                await confirm({ description: confirmDescription, title: confirmTitle });
                if (action) {
                  await action();
                }
                navigate(to);
                // eslint-disable-next-line @typescript-eslint/no-unused-vars
              } catch (error) {
                /* empty */
              }
            }
          : undefined
      }
    >
      <Typography component={'span'}>{children}</Typography>
    </Link>
  );
}
