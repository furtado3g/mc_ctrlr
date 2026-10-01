<?php

namespace App\Http\Controllers;

use App\Http\Requests\AvatarUploadRequest;
use App\Http\Requests\UserProfileDetailsRequest;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Storage;
use Inertia\Inertia;

class UserProfileController extends Controller
{
    public function uploadAvatar(AvatarUploadRequest $request): RedirectResponse
    {
        $user = $request->user();
        $profile = $user->profile()->firstOrCreate([]);

        if ($profile->avatar_path && Storage::disk('public')->exists($profile->avatar_path)) {
            Storage::disk('public')->delete($profile->avatar_path);
        }

        $path = $request->file('avatar')->store('avatars', 'public');
        $profile->update(['avatar_path' => $path]);

        Inertia::flash('toast', ['type' => 'success', 'message' => 'Foto de perfil atualizada com sucesso.']);

        return back();
    }

    public function removeAvatar(Request $request): RedirectResponse
    {
        $user = $request->user();
        $profile = $user->profile;

        if ($profile && $profile->avatar_path) {
            if (Storage::disk('public')->exists($profile->avatar_path)) {
                Storage::disk('public')->delete($profile->avatar_path);
            }
            $profile->update(['avatar_path' => null]);
        }

        Inertia::flash('toast', ['type' => 'success', 'message' => 'Foto de perfil removida.']);

        return back();
    }

    public function updateDetails(UserProfileDetailsRequest $request): RedirectResponse
    {
        $user = $request->user();
        $profile = $user->profile()->firstOrCreate([]);
        $profile->update($request->validated());

        Inertia::flash('toast', ['type' => 'success', 'message' => 'Informações do perfil atualizadas.']);

        return back();
    }
}
