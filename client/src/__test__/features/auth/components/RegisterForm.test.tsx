import { render, screen } from '../../../../utils/TestUtil'
import '@testing-library/jest-dom'
import { RegistrationForm } from '../../../../features/auth/components/RegistrationForm/RegistrationForm';
import { useState } from 'react';

describe('RegisterForm', () => {
    test('should load the Register page', async () => {
        render(<RegistrationForm />)
        expect(screen.getByRole('button', { name: /SIGN UP/i})).toBeInTheDocument()
    })
});