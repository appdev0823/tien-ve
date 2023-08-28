import { createFeatureSelector } from '@ngrx/store';
import { LoginUserDTO } from 'src/app/dtos';

export const selectAuthState = createFeatureSelector<{ current_user: LoginUserDTO }>('auth');
