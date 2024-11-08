import { LoadingButton } from '@mui/lab';
import { Box, Container, FormHelperText, TextField, Typography } from '@mui/material';
import { Controller, useForm } from 'react-hook-form';
import { Navigate, useSearchParams } from 'react-router-dom';
import { useFetchUserInfo, useLogin } from '../services/authen';
import { useState } from 'react';
import { FormattedMessage, useIntl } from 'react-intl';

export function LoginPage() {
  const { data } = useFetchUserInfo();
  const [searchParams] = useSearchParams();
  const { mutateAsync, isPending } = useLogin();
  const [loginError, setLoginError] = useState('');
  const intl = useIntl();

  const formMethods = useForm({ defaultValues: { email: '', password: '' } });
  if (data) {
    if (data.user.role === 'admin') {
      return <Navigate to={`${searchParams.get('from') || '/admin'}`} />;
    }
    return <Navigate to={`${searchParams.get('from') || '/list-quizzes'}`} />;
  }

  return (
    <Container>
      <Box paddingY={4} paddingX={2}>
        <Box
          display={'flex'}
          flexDirection={'column'}
          alignItems={'stretch'}
          margin={'auto'}
          width={400}
          component={'form'}
          onSubmit={formMethods.handleSubmit(async (data) => {
            const res = await mutateAsync(data);
            setLoginError(res || '');
          })}
          rowGap={2}
        >
          <Box display={'flex'} justifyContent={'center'}>
            <Typography variant="subtitle1">
              <FormattedMessage defaultMessage={'Please login'} />
            </Typography>
          </Box>
          <Controller
            control={formMethods.control}
            name="email"
            rules={{ required: true }}
            render={({ field, fieldState }) => (
              <TextField
                label={intl.formatMessage({ defaultMessage: 'Email' })}
                fullWidth
                error={fieldState.error ? true : false}
                value={field.value}
                onChange={field.onChange}
              />
            )}
          />
          <Controller
            control={formMethods.control}
            name="password"
            rules={{ required: true }}
            render={({ field, fieldState }) => (
              <TextField
                label={intl.formatMessage({ defaultMessage: 'Password' })}
                type="password"
                fullWidth
                error={fieldState.error ? true : false}
                value={field.value}
                onChange={field.onChange}
              />
            )}
          />
          <FormHelperText margin="dense" error>
            {loginError}&nbsp;
          </FormHelperText>
          <LoadingButton variant="contained" fullWidth loading={isPending} type="submit">
            <FormattedMessage defaultMessage={'Login'} />
          </LoadingButton>
        </Box>
      </Box>
    </Container>
  );
}
